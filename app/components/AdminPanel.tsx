'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { VERSION_LIMITS } from '@/lib/types';
import type { LessonResponseRow, ResponseSummary, VersionRow } from '@/lib/types';

const SAMPLE = `[
  {
    "title": "Example lesson",
    "ageStart": 3,
    "ageEnd": 4,
    "status": "ACTIVE",
    "description": "Paste the API response array/object as-is.",
    "sections": [
      {
        "localSectionKey": "learning-objective",
        "title": "Learning Objective",
        "description": "[\\"First bullet\\",\\"Second bullet\\"]",
        "order": 1,
        "sectionResources": []
      }
    ],
    "schedules": [{ "unit": 1, "week": 1, "day": 1 }],
    "resources": []
  }
]`;

/** Sentinel value of the version dropdown: "＋ Create new version…". */
const NEW_VERSION = '__new__';
const NEW_RESPONSE = 'new';

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

function defaultName() {
  return `response on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export default function AdminPanel() {
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [rows, setRows] = useState<ResponseSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>(NEW_RESPONSE);

  // editor
  const [name, setName] = useState(defaultName);
  const [jsonText, setJsonText] = useState(SAMPLE);
  const [versionChoice, setVersionChoice] = useState('');
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [editorReady, setEditorReady] = useState(true);

  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isNew = selectedId === NEW_RESPONSE;
  const selected = useMemo(() => rows.find((r) => r.id === selectedId) || null, [rows, selectedId]);
  const latestVersion = versions[versions.length - 1];
  const creatingVersion = versionChoice === NEW_VERSION;
  const suggestedVersionName = `v${(latestVersion?.ordinal ?? -1) + 1}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [v, r] = await Promise.all([
        api<{ versions: VersionRow[] }>('/api/versions'),
        api<{ responses: ResponseSummary[] }>('/api/responses'),
      ]);
      setVersions(v.versions);
      setRows(r.responses);
      setStatus(`${plural(r.responses.length, 'response')} in ${plural(v.versions.length, 'version')}`);
      return v.versions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load().then((list) => {
      if (list?.length) setVersionChoice((c) => c || list[list.length - 1].id);
    });
  }, [load]);

  // Hydrate the editor only when the selection changes (not on every list refresh).
  useEffect(() => {
    setError(null);
    if (selectedId === NEW_RESPONSE) {
      setName(defaultName());
      setJsonText(SAMPLE);
      setVersionChoice((c) => (c === NEW_VERSION ? c : latestVersion?.id || c));
      setEditorReady(true);
      return;
    }

    let cancelled = false;
    setEditorReady(false);
    api<LessonResponseRow>(`/api/responses/${selectedId}`)
      .then((row) => {
        if (cancelled) return;
        setName(row.name);
        setJsonText(JSON.stringify(row.payload, null, 2));
        setVersionChoice(row.version_id);
        setEditorReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load response');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const duplicateName = useMemo(() => {
    const target = name.trim().toLowerCase();
    if (!target || creatingVersion) return false;
    return rows.some(
      (r) => r.id !== selectedId && r.version_id === versionChoice && r.name.trim().toLowerCase() === target
    );
  }, [rows, name, selectedId, versionChoice, creatingVersion]);

  function startNewVersion() {
    setNewVersionName(suggestedVersionName);
    setNewVersionDesc('');
    setVersionChoice(NEW_VERSION);
  }

  function onVersionChange(value: string) {
    if (value === NEW_VERSION) startNewVersion();
    else setVersionChoice(value);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      let payload: unknown;
      try {
        payload = JSON.parse(jsonText);
      } catch {
        throw new Error('JSON is invalid — paste the API response as-is');
      }

      // Create the version first when asked; it then becomes the selected one so a
      // failed response save can simply be retried without creating it twice.
      let versionId = versionChoice;
      let createdVersion: VersionRow | null = null;
      if (creatingVersion) {
        createdVersion = await api<VersionRow>(
          '/api/versions',
          jsonInit('POST', { name: newVersionName, description: newVersionDesc })
        );
        versionId = createdVersion.id;
        setVersionChoice(versionId);
      }
      if (!versionId) throw new Error('Choose a version');

      const saved = await api<LessonResponseRow>(
        isNew ? '/api/responses' : `/api/responses/${selectedId}`,
        jsonInit(isNew ? 'POST' : 'PUT', {
          name: name.trim() || 'Untitled response',
          payload,
          versionId,
        })
      );

      await load();
      setSelectedId(saved.id);
      const where = createdVersion ? `new version ${createdVersion.name}` : 'version';
      setStatus(`${isNew ? 'Created' : 'Updated'} “${saved.name}” in ${where}`);
    } catch (err) {
      if (creatingVersion) void load(); // a version may have been created before the failure
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (isNew) return;
    const comments = selected?.comment_count ?? 0;
    if (!confirm(`Delete this response and its ${plural(comments, 'comment')}? This cannot be undone.`)) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api(`/api/responses/${selectedId}`, { method: 'DELETE' });
      setSelectedId(NEW_RESPONSE);
      await load();
      setStatus('Deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  }

  async function removeVersion(v: VersionRow) {
    if (!confirm(`Delete empty version ${v.name}?`)) return;
    setError(null);
    try {
      await api(`/api/versions/${v.id}`, { method: 'DELETE' });
      const list = await load();
      if (versionChoice === v.id) setVersionChoice(list?.[list.length - 1]?.id ?? '');
      setStatus(`Deleted version ${v.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  const newestFirst = useMemo(() => [...versions].reverse(), [versions]);
  const saveDisabled = saving || !editorReady || !versionChoice;

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="logo">TOONDEMY</span>
        </div>
        <div className="crumb">
          <b>Lesson Plan</b> &nbsp;›&nbsp; Admin
        </div>
      </header>

      <div className="toolbar">
        <Link className="toolbar-link" href="/">
          ← Tester
        </Link>
        <button type="button" className="primary" onClick={() => setSelectedId(NEW_RESPONSE)}>
          New response
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedId(NEW_RESPONSE);
            startNewVersion();
          }}
        >
          New version
        </button>
        <button type="button" disabled={loading} onClick={() => void load()}>
          Refresh list
        </button>
        <span className="status">{status}</span>
      </div>

      <main className="admin-layout">
        <aside className="admin-list">
          <h2>Saved responses</h2>
          {loading && !versions.length && <div className="empty">Loading…</div>}
          {newestFirst.map((v) => {
            const items = rows.filter((r) => r.version_id === v.id);
            return (
              <div key={v.id} className="version-group">
                <div className="version-group-head">
                  <strong>{v.name}</strong>
                  <small>{plural(items.length, 'response')}</small>
                  {v.ordinal !== 0 && items.length === 0 && (
                    <button
                      type="button"
                      className="version-delete"
                      title="Delete empty version"
                      onClick={() => void removeVersion(v)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                {v.description && <p className="version-desc">{v.description}</p>}
                {items.length === 0 ? (
                  <div className="version-empty">No responses yet</div>
                ) : (
                  <ul>
                    {items.map((row) => (
                      <li key={row.id}>
                        <button
                          type="button"
                          className={row.id === selectedId ? 'active' : ''}
                          onClick={() => setSelectedId(row.id)}
                        >
                          <strong>{row.name}</strong>
                          <small>
                            {new Date(row.updated_at || row.created_at).toLocaleString()} ·{' '}
                            {plural(row.comment_count, 'comment')}
                          </small>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </aside>

        <section className="admin-editor page">
          <h1 className="lesson-title">{isNew ? 'Add response' : 'Edit response'}</h1>
          <p className="lesson-desc">
            Every response belongs to one version. Reviewers pick a version in the tester and
            compare the responses inside it, leaving comments on each section.
          </p>

          {error && <div className="error">{error}</div>}

          <div className="admin-row">
            <label className="admin-field">
              <span>Version</span>
              <select value={versionChoice} onChange={(e) => onVersionChange(e.target.value)}>
                {!versionChoice && <option value="">Select a version…</option>}
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
                <option value={NEW_VERSION}>＋ Create new version…</option>
              </select>
            </label>

            <label className="admin-field grow">
              <span>Response name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="response v3"
              />
              {duplicateName && (
                <em className="field-warn">Another response in this version already uses this name.</em>
              )}
            </label>
          </div>

          {creatingVersion && (
            <div className="new-version-box">
              <label className="admin-field">
                <span>New version name</span>
                <input
                  value={newVersionName}
                  maxLength={VERSION_LIMITS.name}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder={suggestedVersionName}
                />
              </label>
              <label className="admin-field grow">
                <span>What changed in this version? (optional)</span>
                <input
                  value={newVersionDesc}
                  maxLength={VERSION_LIMITS.description}
                  onChange={(e) => setNewVersionDesc(e.target.value)}
                  placeholder="e.g. New prompt with age-specific vocabulary"
                />
              </label>
            </div>
          )}

          <label className="admin-field">
            <span>API response JSON (as-is)</span>
            <textarea
              className="admin-json"
              value={jsonText}
              disabled={!editorReady}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className="feedback-row">
            <button type="button" className="primary" disabled={saveDisabled} onClick={() => void save()}>
              {saving
                ? 'Saving…'
                : isNew
                  ? creatingVersion
                    ? 'Create version & add response'
                    : 'Add response'
                  : creatingVersion
                    ? 'Create version & move response'
                    : 'Save changes'}
            </button>
            {!isNew && (
              <button type="button" className="danger" disabled={saving} onClick={() => void remove()}>
                Delete
              </button>
            )}
            {selected && <span className="feedback-note">id: {selected.id}</span>}
          </div>
        </section>
      </main>
    </>
  );
}

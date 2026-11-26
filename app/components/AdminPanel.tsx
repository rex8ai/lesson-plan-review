'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  NEW_VERSION,
  api,
  defaultResponseName as defaultName,
  ensureVersion,
  jsonInit,
  plural,
} from '@/lib/client';
import { suggestVersionName } from '@/lib/lesson';
import type { LessonResponseRow, ResponseSummary, VersionRow } from '@/lib/types';
import ApiCaller from './ApiCaller';
import { NewVersionFields, VersionSelect } from './VersionPicker';

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

const NEW_RESPONSE = 'new';

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
  const [apiOpen, setApiOpen] = useState(false);
  // Response handed over from "Call API → Open in editor"; consumed by the hydrate effect.
  const draftRef = useRef<{ name: string; json: string } | null>(null);

  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isNew = selectedId === NEW_RESPONSE;
  const selected = useMemo(() => rows.find((r) => r.id === selectedId) || null, [rows, selectedId]);
  const latestVersion = versions[versions.length - 1];
  const creatingVersion = versionChoice === NEW_VERSION;
  const suggestedVersionName = suggestVersionName(versions);

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
      const draft = draftRef.current;
      draftRef.current = null;
      setName(draft?.name ?? defaultName());
      setJsonText(draft?.json ?? SAMPLE);
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
      const { id: versionId, created: createdVersion } = await ensureVersion(
        versionChoice,
        newVersionName,
        newVersionDesc
      );
      if (createdVersion) setVersionChoice(versionId);

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

  /** Refresh lists after the API panel saved a response (editor selection is left alone). */
  async function onApiSaved(saved: LessonResponseRow, createdVersion: VersionRow | null) {
    await load();
    setStatus(`Saved “${saved.name}”${createdVersion ? ` in new version ${createdVersion.name}` : ''}`);
  }

  function openInEditor(draft: { name: string; json: string }) {
    draftRef.current = draft;
    if (selectedId === NEW_RESPONSE) {
      // Selection will not change, so the hydrate effect won't run: apply directly.
      draftRef.current = null;
      setName(draft.name);
      setJsonText(draft.json);
      setEditorReady(true);
    } else {
      setSelectedId(NEW_RESPONSE);
    }
    setError(null);
    window.setTimeout(
      () => document.getElementById('response-editor')?.scrollIntoView({ behavior: 'smooth' }),
      50
    );
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
        <button type="button" className={apiOpen ? 'toggled' : ''} onClick={() => setApiOpen((o) => !o)}>
          Call API
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

        <div className="admin-main">
        {apiOpen && (
          <ApiCaller
            versions={versions}
            suggestedVersionName={suggestedVersionName}
            onClose={() => setApiOpen(false)}
            onSaved={onApiSaved}
            onOpenInEditor={openInEditor}
          />
        )}
        <section id="response-editor" className="admin-editor page">
          <h1 className="lesson-title">{isNew ? 'Add response' : 'Edit response'}</h1>
          <p className="lesson-desc">
            Every response belongs to one version. Reviewers pick a version in the tester and
            compare the responses inside it, leaving comments on each section.
          </p>

          {error && <div className="error">{error}</div>}

          <div className="admin-row">
            <VersionSelect versions={versions} value={versionChoice} onChange={onVersionChange} />

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
            <NewVersionFields
              name={newVersionName}
              description={newVersionDesc}
              suggestedName={suggestedVersionName}
              onName={setNewVersionName}
              onDescription={setNewVersionDesc}
            />
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
        </div>
      </main>
    </>
  );
}

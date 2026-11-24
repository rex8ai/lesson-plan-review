'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LessonResponseRow } from '@/lib/types';

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

export default function AdminPanel() {
  const [rows, setRows] = useState<LessonResponseRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | 'new'>('new');
  const [name, setName] = useState('response on 23 Nov');
  const [jsonText, setJsonText] = useState(SAMPLE);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const selected = useMemo(
    () => (selectedId === 'new' ? null : rows.find((r) => r.id === selectedId) || null),
    [rows, selectedId]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/responses');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setRows((data.responses || []) as LessonResponseRow[]);
      setStatus(`${(data.responses || []).length} responses`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedId === 'new') {
      setName(
        `response on ${new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })}`
      );
      setJsonText(SAMPLE);
      return;
    }
    const row = rows.find((r) => r.id === selectedId);
    if (!row) return;
    setName(row.name);
    setJsonText(JSON.stringify(row.payload, null, 2));
    // Only hydrate editor when the selected id changes (not on every list refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

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

      const trimmedName = name.trim() || 'Untitled response';
      const isNew = selectedId === 'new';
      const res = await fetch(isNew ? '/api/responses' : `/api/responses/${selectedId}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      await load();
      setSelectedId(data.id);
      setStatus(isNew ? `Created “${data.name}”` : `Updated “${data.name}”`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (selectedId === 'new') return;
    if (!confirm('Delete this response and its feedback?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/responses/${selectedId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setSelectedId('new');
      await load();
      setStatus('Deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  }

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
        <button type="button" className="primary" onClick={() => setSelectedId('new')}>
          New response
        </button>
        <button type="button" disabled={loading} onClick={() => void load()}>
          Refresh list
        </button>
        <span className="status">{status}</span>
      </div>

      <main className="admin-layout">
        <aside className="admin-list">
          <h2>Saved responses</h2>
          {loading && <div className="empty">Loading…</div>}
          {!loading && !rows.length && <div className="empty">None yet</div>}
          <ul>
            {rows.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className={row.id === selectedId ? 'active' : ''}
                  onClick={() => setSelectedId(row.id)}
                >
                  <strong>{row.name}</strong>
                  <small>
                    {row.updated_at || row.created_at
                      ? new Date(row.updated_at || row.created_at || '').toLocaleString()
                      : ''}
                  </small>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="admin-editor page">
          <h1 className="lesson-title">
            {selectedId === 'new' ? 'Add response' : 'Edit response'}
          </h1>
          <p className="lesson-desc">
            Name is only a label (e.g. <code>response v3</code>, <code>response on 23 Nov</code>).
            Each entry is stored with its own id, so you can keep many responses with any names.
          </p>

          {error && <div className="error">{error}</div>}

          <label className="admin-field">
            <span>Key name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="response v3"
            />
          </label>

          <label className="admin-field">
            <span>API response JSON (as-is)</span>
            <textarea
              className="admin-json"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className="feedback-row">
            <button type="button" className="primary" disabled={saving} onClick={() => void save()}>
              {saving ? 'Saving…' : selectedId === 'new' ? 'Add response' : 'Save changes'}
            </button>
            {selectedId !== 'new' && (
              <button type="button" className="danger" disabled={saving} onClick={() => void remove()}>
                Delete
              </button>
            )}
            {selected && (
              <span className="feedback-note">id: {selected.id}</span>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

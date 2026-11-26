'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  NEW_VERSION,
  api,
  defaultResponseName,
  ensureVersion,
  jsonInit,
} from '@/lib/client';
import { validatePayload } from '@/lib/lesson';
import type { LessonResponseRow, VersionRow } from '@/lib/types';
import { NewVersionFields, VersionSelect } from './VersionPicker';

// v2: v1 stored the base URL and the API key in the browser. Those now live on the server.
const STORAGE_KEY = 'lpt:api-request:v2';
const LEGACY_STORAGE_KEY = 'lpt:api-request';

type ApiConfig = { baseUrl: string | null; apiKeyConfigured: boolean };

// Only the path and body are editable; the base URL and X-API-Key come from the server env.
const DEFAULT_REQUEST = {
  method: 'POST',
  path: '/cbse-lesson-plans/generate',
  headers: ['Content-Type: application/json', 'Authorization;'].join('\n'),
  body: JSON.stringify(
    {
      classId: 'ac884ce2-77b8-4b2f-b6f7-a9a7c80e41bb',
      branchId: '835c5175-fdc3-4610-ad88-6ddf9441f893',
      levelId: 'e8fd8484-f0fe-4a09-8f1c-f4a7203b2b07',
      boardId: '26a034e7-0bcc-11f1-9afc-0a0d80a5c04d',
      unit: 1,
      day: 2,
      week: 1,
      schoolId: 'a9a709e5-386b-403c-a1c5-a155ff8fdcfc',
      gradeId: '29846cf5-5adb-4681-a3ac-fb70e72ac428',
      domains: [
        {
          domainName: 'General Awareness',
          domainId: 'd0a2c33f-8d71-4a99-999d-7a8c710ae72f',
          lessonPlans: [{ id: 'jiuahsf09010h13j109i-0oa-0sdoa', prompt: 'food sefty' }],
        },
      ],
    },
    null,
    2
  ),
};

type RequestState = typeof DEFAULT_REQUEST;

type ProxyResult = {
  status: number;
  statusText: string;
  ok: boolean;
  contentType: string;
  durationMs: number;
  body: string;
};

function loadRequest(): RequestState {
  // Drop the v1 entry: it may contain an API key typed into the browser.
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      const { method, path, headers, body } = saved as Partial<RequestState>;
      return { ...DEFAULT_REQUEST, method, path, headers, body } as RequestState;
    }
  } catch {
    /* fall through to defaults */
  }
  return DEFAULT_REQUEST;
}

/** One header per line: `Name: value`, or curl-style `Name;` for an empty value. */
function parseHeaders(text: string): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const colon = line.indexOf(':');
    let name: string;
    let value: string;
    if (colon === -1 && line.endsWith(';')) {
      name = line.slice(0, -1).trim();
      value = '';
    } else if (colon > 0) {
      name = line.slice(0, colon).trim();
      value = line.slice(colon + 1).trim();
    } else {
      throw new Error(`Header “${line}” should look like  Name: value`);
    }
    if (!/^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(name)) {
      throw new Error(`“${name}” is not a valid header name`);
    }
    headers[name] = value;
  }
  return headers;
}

/** Best-effort name from the request, so saved responses are easy to tell apart. */
function suggestName(body: string) {
  try {
    const prompt = JSON.parse(body)?.domains?.[0]?.lessonPlans?.[0]?.prompt;
    if (typeof prompt === 'string' && prompt.trim()) return prompt.trim().slice(0, 80);
  } catch {
    /* not JSON */
  }
  return defaultResponseName();
}

function formatBytes(n: number) {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
}

type Props = {
  versions: VersionRow[];
  suggestedVersionName: string;
  onClose: () => void;
  /** Called after a response was saved so the parent can refresh its lists. */
  onSaved: (saved: LessonResponseRow, createdVersion: VersionRow | null) => Promise<void>;
  /** Hands the response to the normal editor (review / tweak before saving). */
  onOpenInEditor: (draft: { name: string; json: string }) => void;
};

export default function ApiCaller({
  versions,
  suggestedVersionName,
  onClose,
  onSaved,
  onOpenInEditor,
}: Props) {
  const [request, setRequest] = useState<RequestState>(loadRequest);
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<ProxyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // save-as
  const [versionChoice, setVersionChoice] = useState('');
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(request));
  }, [request]);

  useEffect(() => {
    api<ApiConfig>('/api/proxy')
      .then(setConfig)
      .catch((err) => setConfigError(err instanceof Error ? err.message : 'Could not read API settings'));
  }, []);

  const configReady = !!config?.baseUrl && config.apiKeyConfigured;

  // Live "waiting…" counter while the request is in flight.
  useEffect(() => {
    if (!sending) return;
    const startedAt = Date.now();
    setElapsed(0);
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => window.clearInterval(timer);
  }, [sending]);

  // Default the target version to the newest one.
  useEffect(() => {
    if (!versions.length) return;
    setVersionChoice((c) => (c === NEW_VERSION || versions.some((v) => v.id === c) ? c : versions[versions.length - 1].id));
  }, [versions]);

  const parsed = useMemo(() => {
    if (!result) return null;
    try {
      return { ok: true as const, value: JSON.parse(result.body) as unknown };
    } catch {
      return { ok: false as const };
    }
  }, [result]);

  const pretty = parsed?.ok ? JSON.stringify(parsed.value, null, 2) : result?.body ?? '';
  const planProblem = parsed?.ok ? validatePayload(parsed.value) : null;
  const canSave = !!parsed?.ok && !planProblem && !saving && !sending;
  const creatingVersion = versionChoice === NEW_VERSION;

  function update<K extends keyof RequestState>(key: K, value: RequestState[K]) {
    setRequest((r) => ({ ...r, [key]: value }));
  }

  async function send() {
    setError(null);
    setSaveError(null);
    setSavedNote(null);

    let headers: Record<string, string>;
    try {
      headers = parseHeaders(request.headers);
      if (!request.path.trim().startsWith('/')) {
        throw new Error('Path must start with / (it is added to the server’s API base URL)');
      }
      const isJson = Object.entries(headers).some(
        ([k, v]) => k.toLowerCase() === 'content-type' && /json/i.test(v)
      );
      if (request.method === 'POST' && request.body.trim() && isJson) {
        try {
          JSON.parse(request.body);
        } catch {
          throw new Error('Body is not valid JSON');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid request');
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setResult(null);
    setSending(true);
    try {
      const data = await api<ProxyResult>('/api/proxy', {
        ...jsonInit('POST', {
          path: request.path.trim(),
          method: request.method,
          headers,
          body: request.method === 'GET' ? undefined : request.body,
        }),
        signal: controller.signal,
      });
      setResult(data);
      setName(suggestName(request.body));
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') setError('Cancelled');
      else setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  async function save() {
    if (!parsed?.ok) return;
    setSaving(true);
    setSaveError(null);
    setSavedNote(null);
    try {
      const { id: versionId, created } = await ensureVersion(versionChoice, newVersionName, newVersionDesc);
      if (created) setVersionChoice(created.id);
      const saved = await api<LessonResponseRow>(
        '/api/responses',
        jsonInit('POST', {
          name: name.trim() || defaultResponseName(),
          payload: parsed.value,
          versionId,
        })
      );
      await onSaved(saved, created);
      const version = created?.name ?? versions.find((v) => v.id === versionId)?.name ?? 'version';
      setSavedNote(`Saved “${saved.name}” in ${version}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function startNewVersion(value: string) {
    if (value === NEW_VERSION) {
      setNewVersionName(suggestedVersionName);
      setNewVersionDesc('');
    }
    setVersionChoice(value);
  }

  return (
    <section className="api-box page">
      <div className="api-head">
        <h2>Call API</h2>
        <button type="button" className="link-button" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="lesson-desc">
        Send a request, then save the response straight into a version. The base URL and API key are read
        from the server’s environment (<code>LESSON_API_BASE_URL</code>, <code>LESSON_API_KEY</code>), so
        they are never typed or stored in the browser.
      </p>
      {configError && <div className="error api-error">{configError}</div>}
      {config && !configReady && (
        <div className="error api-error">
          {!config.baseUrl
            ? 'LESSON_API_BASE_URL is not set on the server (or is not a valid URL).'
            : 'LESSON_API_KEY is not set on the server.'}{' '}
          Add it to .env.local and restart the dev server.
        </div>
      )}
      {config && configReady && (
        <p className="api-target">
          Sends to <code>{config.baseUrl}</code> · API key from server env
        </p>
      )}

      <div className="admin-row">
        <label className="admin-field">
          <span>Method</span>
          <select value={request.method} onChange={(e) => update('method', e.target.value)}>
            <option>POST</option>
            <option>GET</option>
          </select>
        </label>
        <label className="admin-field grow">
          <span>Path</span>
          <div className="path-input">
            <span className="path-base">{config?.baseUrl ?? '…'}</span>
            <input
              value={request.path}
              onChange={(e) => update('path', e.target.value)}
              placeholder="/cbse-lesson-plans/generate"
              spellCheck={false}
            />
          </div>
        </label>
      </div>

      <label className="admin-field">
        <span>Extra headers (one per line, “Name: value”; X-API-Key is added by the server)</span>
        <textarea
          className="admin-json short"
          value={request.headers}
          onChange={(e) => update('headers', e.target.value)}
          spellCheck={false}
        />
      </label>

      {request.method === 'POST' && (
        <label className="admin-field">
          <span>Body</span>
          <textarea
            className="admin-json medium"
            value={request.body}
            onChange={(e) => update('body', e.target.value)}
            spellCheck={false}
          />
        </label>
      )}

      <div className="feedback-row">
        <button
          type="button"
          className="primary"
          disabled={sending || !request.path.trim() || !configReady}
          onClick={() => void send()}
        >
          {sending ? 'Sending…' : 'Send request'}
        </button>
        {sending && (
          <>
            <span className="spinner" role="status" aria-label="Waiting for response" />
            <span className="feedback-note">Waiting for response… {elapsed}s</span>
            <button type="button" className="danger" onClick={cancel}>
              Cancel
            </button>
          </>
        )}
      </div>

      {error && <div className="error api-error">{error}</div>}

      {result && (
        <div className="api-result-box">
          <div className="api-status">
            <span className={`status-pill ${result.ok ? 'ok' : 'bad'}`}>
              {result.status} {result.statusText}
            </span>
            <span className="feedback-note">
              {(result.durationMs / 1000).toFixed(1)}s · {formatBytes(result.body.length)}
            </span>
          </div>

          {!parsed?.ok && <div className="field-warn">The response is not JSON, so it can’t be saved as a lesson plan.</div>}
          {planProblem && <div className="field-warn">{planProblem}. You can still open it in the editor.</div>}

          <textarea className="admin-json medium" readOnly value={pretty} spellCheck={false} />

          <div className="api-save">
            <h3>Save this response</h3>
            <div className="admin-row">
              <VersionSelect versions={versions} value={versionChoice} onChange={startNewVersion} />
              <label className="admin-field grow">
                <span>Response name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="response v3" />
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
            {saveError && <div className="error api-error">{saveError}</div>}
            <div className="feedback-row">
              <button type="button" className="primary" disabled={!canSave} onClick={() => void save()}>
                {saving ? 'Saving…' : creatingVersion ? 'Create version & save' : 'Save response'}
              </button>
              <button
                type="button"
                className="secondary"
                disabled={!result.body}
                onClick={() => onOpenInEditor({ name: name.trim() || defaultResponseName(), json: pretty })}
              >
                Open in editor
              </button>
              {savedNote && <span className="saved-note">✓ {savedNote}</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

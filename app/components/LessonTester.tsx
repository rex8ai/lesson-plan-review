'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CommentThread from './CommentThread';
import {
  OVERALL_FEEDBACK_KEY,
  normalizePlan,
  parseDescription,
  sectionKeyOf,
  sortedSections,
} from '@/lib/lesson';
import type {
  CommentRow,
  LessonResource,
  LessonResponseRow,
  ResponseSummary,
  VersionRow,
} from '@/lib/types';

const ICONS = ['◎', '✦', '↗', '◇', '✓', '♡', '▣', '☼'];

function isImage(url?: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url || '');
}

function ResourceChip({ resource }: { resource: LessonResource }) {
  const url = resource.resourceUrl || '#';
  const label = resource.label || resource.type || 'Resource';
  return (
    <a className="resource" href={url} target="_blank" rel="noopener noreferrer" title={url}>
      {isImage(url) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" />
      ) : (
        <span className="file-icon">↗</span>
      )}
      <span className="meta-text">
        <span className="label">{label}</span>
        <small>{resource.type || 'link'}</small>
      </span>
    </a>
  );
}

const REVIEWER_STORAGE_KEY = 'lpt:reviewer';

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function isLearningCompetency(title?: string) {
  return (title || '').trim().toLowerCase() === 'learning competency';
}

/**
 * "C-7.1 - Observes … | “Learners …”" → bold first part, then " - " in place of "|".
 * Strings without a "|" are returned unchanged.
 */
function formatCompetency(item: string) {
  if (!item.includes('|')) return item;
  const [head, ...rest] = item.split('|').map((part) => part.trim());
  return (
    <>
      <strong>{head}</strong> - {rest.join(' - ')}
    </>
  );
}

/** Seeded names are "key — Title (Age n–n)"; the dropdown only needs the key. */
function responseOptionLabel(name: string) {
  const head = name.split(' — ')[0] ?? name;
  return head.replace(/\s*\(Age\s+[^)]*\)\s*$/i, '').trim() || name;
}

export default function LessonTester() {
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [versionId, setVersionId] = useState('');
  const [responses, setResponses] = useState<ResponseSummary[]>([]);
  const [responseId, setResponseId] = useState('');
  const [detail, setDetail] = useState<LessonResponseRow | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [reviewer, setReviewer] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  // Selection requested via the URL (?version=…&response=…); consumed once on load.
  const wanted = useRef<{ version: string | null; response: string | null }>({
    version: null,
    response: null,
  });

  const version = useMemo(() => versions.find((v) => v.id === versionId) || null, [versions, versionId]);
  const plan = useMemo(() => normalizePlan(detail?.payload), [detail]);
  const sections = useMemo(() => sortedSections(plan), [plan]);

  const commentsByKey = useMemo(() => {
    const map: Record<string, CommentRow[]> = {};
    for (const c of comments) (map[c.section_key] ||= []).push(c);
    return map;
  }, [comments]);

  // ── bootstrap: reviewer name + URL selection + versions ────────────────────
  const loadVersions = useCallback(async () => {
    const data = await api<{ versions: VersionRow[] }>('/api/versions');
    setVersions(data.versions);
    const wantedVersion = wanted.current.version; // capture: state updaters run later
    wanted.current.version = null;
    setVersionId((current) => {
      const pick = (id: string | null) => data.versions.find((v) => v.id === id)?.id;
      return (
        pick(wantedVersion) ||
        pick(current) ||
        data.versions[data.versions.length - 1]?.id || // newest version by default
        ''
      );
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    wanted.current = { version: params.get('version'), response: params.get('response') };
    setReviewer(window.localStorage.getItem(REVIEWER_STORAGE_KEY) || '');

    loadVersions()
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load versions'))
      .finally(() => setLoadingList(false));
  }, [loadVersions]);

  // ── responses of the selected version ──────────────────────────────────────
  useEffect(() => {
    if (!versionId) return;
    let cancelled = false;
    setLoadingList(true);
    api<{ responses: ResponseSummary[] }>(`/api/responses?versionId=${versionId}`)
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setResponses(data.responses);
        const wantedResponse = wanted.current.response; // capture: state updaters run later
        wanted.current.response = null;
        setResponseId((current) => {
          const pick = (id: string | null) => data.responses.find((r) => r.id === id)?.id;
          return pick(wantedResponse) || pick(current) || data.responses[0]?.id || '';
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setResponses([]);
        setResponseId('');
        setError(err instanceof Error ? err.message : 'Failed to load responses');
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [versionId, reloadTick]);

  // ── selected response: payload + its comments ──────────────────────────────
  useEffect(() => {
    setDetail(null);
    setComments([]);
    if (!responseId) return;
    let cancelled = false;
    setLoadingDetail(true);
    Promise.all([
      api<LessonResponseRow>(`/api/responses/${responseId}`),
      api<{ comments: CommentRow[] }>(`/api/responses/${responseId}/comments`),
    ])
      .then(([row, c]) => {
        if (cancelled) return;
        setError(null);
        setDetail(row);
        setComments(c.comments);
        setCollapsed({});
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load response');
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [responseId, reloadTick]);

  // Keep the URL shareable so teammates land on the same version + response.
  useEffect(() => {
    if (!versionId) return;
    const params = new URLSearchParams({ version: versionId });
    if (responseId) params.set('response', responseId);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [versionId, responseId]);

  function reload() {
    setError(null);
    void loadVersions().catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load versions')
    );
    setReloadTick((n) => n + 1);
  }

  function changeVersion(id: string) {
    setResponseId('');
    setResponses([]);
    setVersionId(id);
  }

  function changeReviewer(value: string) {
    setReviewer(value);
    window.localStorage.setItem(REVIEWER_STORAGE_KEY, value);
  }

  // ── comments ───────────────────────────────────────────────────────────────
  function bumpCount(delta: number) {
    setResponses((list) =>
      list.map((r) =>
        r.id === responseId ? { ...r, comment_count: Math.max(0, r.comment_count + delta) } : r
      )
    );
  }

  async function addComment(sectionKey: string, sectionTitle: string | null, body: string) {
    const created = await api<CommentRow>(`/api/responses/${responseId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionKey,
        sectionTitle,
        author: reviewer.trim() || 'Anonymous',
        body,
      }),
    });
    setComments((list) => [...list, created]);
    bumpCount(1);
  }

  async function deleteComment(comment: CommentRow) {
    await api(`/api/responses/${responseId}/comments/${comment.id}`, { method: 'DELETE' });
    setComments((list) => list.filter((c) => c.id !== comment.id));
    bumpCount(-1);
  }

  function expandAll() {
    setCollapsed({});
  }

  function collapseAll() {
    const next: Record<string, boolean> = {};
    sections.forEach((section, index) => {
      next[sectionKeyOf(section, index)] = true;
    });
    setCollapsed(next);
  }

  const schedule = (plan?.schedules || [])
    .map((s) =>
      [`Unit ${s.unit}`, `Week ${s.week}`, `Day ${s.day}`]
        .filter((x) => !x.endsWith('undefined'))
        .join(' · ')
    )
    .join(' | ');

  const overallComments = commentsByKey[OVERALL_FEEDBACK_KEY] || [];
  const noResponses = !loadingList && !!versionId && !responses.length;

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="logo">TOONDEMY</span>
        </div>
        <div className="crumb">
          <b>Lesson Plan</b> &nbsp;›&nbsp; Response Tester
        </div>
      </header>

      <div className="toolbar">
        <label htmlFor="versionSelect">Version</label>
        <select
          id="versionSelect"
          value={versionId}
          disabled={!versions.length}
          onChange={(e) => changeVersion(e.target.value)}
        >
          {!versions.length ? (
            <option value="">{loadingList ? 'Loading…' : 'No versions'}</option>
          ) : (
            versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))
          )}
        </select>

        <label htmlFor="responseSelect">Response</label>
        <select
          id="responseSelect"
          value={responseId}
          disabled={!responses.length}
          onChange={(e) => setResponseId(e.target.value)}
        >
          {!responses.length ? (
            <option value="">{loadingList ? 'Loading…' : 'No responses'}</option>
          ) : (
            responses.map((row) => (
              <option key={row.id} value={row.id}>
                {responseOptionLabel(row.name)}
                {row.comment_count ? ` · ${plural(row.comment_count, 'comment')}` : ''}
              </option>
            ))
          )}
        </select>

        <button className="primary" type="button" disabled={loadingList} onClick={reload}>
          {loadingList ? 'Loading…' : 'Reload'}
        </button>
        <button type="button" onClick={expandAll} disabled={!sections.length}>
          Expand all
        </button>
        <button type="button" onClick={collapseAll} disabled={!sections.length}>
          Collapse all
        </button>

        <label className="toolbar-right" htmlFor="reviewerName">
          Commenting as
        </label>
        <input
          id="reviewerName"
          className="reviewer-input"
          value={reviewer}
          maxLength={60}
          placeholder="Your name"
          onChange={(e) => changeReviewer(e.target.value)}
        />
      </div>

      {plan && detail && (
        <div className="meta">
          <span className="chip">
            Age {plan.ageStart ?? '?'}–{plan.ageEnd ?? '?'}
          </span>
          <span className="chip">{plan.status || 'Status unavailable'}</span>
          {schedule ? <span className="chip">{schedule}</span> : null}
          <span className="chip">{plural(sections.length, 'section')}</span>
          <span className="chip">{plural(comments.length, 'comment')}</span>
          {version?.description ? <span className="chip-note">{version.description}</span> : null}
        </div>
      )}

      <main className="page">
        {error && <div className="error">{error}</div>}
        {(loadingList || loadingDetail) && !plan && <div className="empty">Loading lesson plan…</div>}
        {noResponses && !error && (
          <div className="empty">
            No responses in {version?.name || 'this version'} yet. Add one from /admin.
          </div>
        )}
        {!loadingDetail && detail && !plan && (
          <div className="error">
            Could not parse lesson payload for “{detail.name}”. Check the JSON in /admin.
          </div>
        )}

        {plan && detail && (
          <>
            <h1 className="lesson-title">{plan.title || 'Untitled lesson plan'}</h1>
            <p className="lesson-desc">{plan.description || ''}</p>

            {sections.map((section, index) => {
              const key = sectionKeyOf(section, index);
              const items = parseDescription(section.description);
              const isCollapsed = !!collapsed[key];
              const sectionComments = commentsByKey[key] || [];

              return (
                <section key={key} className={`section${isCollapsed ? ' collapsed' : ''}`}>
                  <div className="section-head">
                    <div className="section-name">
                      <span>{ICONS[index % ICONS.length]}</span>
                      {section.title || 'Untitled section'}
                    </div>
                    <div className="actions">
                      {sectionComments.length ? (
                        <span className="feedback-badge" title="Comments on this section">
                          {plural(sectionComments.length, 'comment')}
                        </span>
                      ) : null}
                      <button
                        className="action"
                        type="button"
                        aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                        onClick={() => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))}
                      >
                        {isCollapsed ? '⌄' : '⌃'}
                      </button>
                    </div>
                  </div>

                  <div className="section-body">
                    {items.length ? (
                      <ul>
                        {items.map((item, i) => (
                          <li key={`${key}-${i}`}>
                            {isLearningCompetency(section.title) ? formatCompetency(item) : item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="empty">No description provided</div>
                    )}

                    {!!section.sectionResources?.length && (
                      <div className="resource-area">
                        <div className="resource-title">Section resources</div>
                        <div className="resources">
                          {section.sectionResources.map((resource, i) => (
                            <ResourceChip key={`${key}-res-${i}`} resource={resource} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="feedback">
                      <div className="feedback-label">Section comments</div>
                      <CommentThread
                        comments={sectionComments}
                        placeholder="Add a comment on this section…"
                        submitLabel="Add comment"
                        onAdd={(body) => addComment(key, section.title || null, body)}
                        onDelete={deleteComment}
                      />
                    </div>
                  </div>
                </section>
              );
            })}

            {!!plan.resources?.length && (
              <div className="lesson-resources">
                <h3>Lesson resources</h3>
                <div className="resources">
                  {plan.resources.map((resource, i) => (
                    <ResourceChip key={`lesson-res-${i}`} resource={resource} />
                  ))}
                </div>
              </div>
            )}

            <div className="overall-feedback">
              <div className="overall-feedback-head">
                <h3>Overall lesson plan comments</h3>
                {overallComments.length ? (
                  <span className="feedback-badge">{plural(overallComments.length, 'comment')}</span>
                ) : null}
              </div>
              <p className="overall-feedback-desc">
                Comment on the whole lesson plan (not just one section).
              </p>
              <CommentThread
                comments={overallComments}
                placeholder="Add an overall comment…"
                submitLabel="Add overall comment"
                onAdd={(body) => addComment(OVERALL_FEEDBACK_KEY, 'Overall lesson plan', body)}
                onDelete={deleteComment}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}

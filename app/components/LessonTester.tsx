'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  OVERALL_FEEDBACK_KEY,
  normalizePlan,
  parseDescription,
  sectionKeyOf,
  sortedSections,
} from '@/lib/lesson';
import type {
  LessonResource,
  LessonResponseRow,
  LessonSection,
  SectionFeedbackRow,
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

export default function LessonTester() {
  const [rows, setRows] = useState<LessonResponseRow[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [draftMap, setDraftMap] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedRow = useMemo(
    () => rows.find((r) => r.id === selectedId) || null,
    [rows, selectedId]
  );

  const plan = useMemo(() => normalizePlan(selectedRow?.payload), [selectedRow]);
  const sections = useMemo(() => sortedSections(plan), [plan]);

  const loadFeedback = useCallback(async (responseId: string) => {
    const res = await fetch(`/api/feedback/${encodeURIComponent(responseId)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to load feedback');
    const next: Record<string, string> = {};
    for (const row of (data.feedback || []) as SectionFeedbackRow[]) {
      next[row.section_key] = row.feedback || '';
    }
    setFeedbackMap(next);
    setDraftMap(next);
  }, []);

  const loadResponses = useCallback(async (preferId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/responses', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed to load responses (${res.status})`);
      const list = Array.isArray(data.responses) ? (data.responses as LessonResponseRow[]) : [];
      setRows(list);
      setSelectedId((current) => {
        if (preferId && list.some((r) => r.id === preferId)) return preferId;
        if (current && list.some((r) => r.id === current)) return current;
        return list[0]?.id || '';
      });
    } catch (err) {
      setRows([]);
      setSelectedId('');
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResponses();
  }, [loadResponses]);

  useEffect(() => {
    if (!selectedId) {
      setFeedbackMap({});
      setDraftMap({});
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        await loadFeedback(selectedId);
        if (!cancelled) setCollapsed({});
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load feedback');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId, loadFeedback]);

  async function saveFeedbackForKey(key: string, sectionTitle: string | null) {
    if (!selectedId) return;
    setSavingKey(key);
    setError(null);
    try {
      const res = await fetch(
        `/api/feedback/${encodeURIComponent(selectedId)}/${encodeURIComponent(key)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feedback: draftMap[key] ?? '',
            sectionTitle,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setFeedbackMap((prev) => ({ ...prev, [key]: data.feedback || '' }));
      setDraftMap((prev) => ({ ...prev, [key]: data.feedback || '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingKey(null);
    }
  }

  async function saveFeedback(section: LessonSection, index: number) {
    await saveFeedbackForKey(sectionKeyOf(section, index), section.title || null);
  }

  async function saveOverallFeedback() {
    await saveFeedbackForKey(OVERALL_FEEDBACK_KEY, 'Overall lesson plan');
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

  const selectValue = rows.some((r) => r.id === selectedId) ? selectedId : '';
  const overallSaved = feedbackMap[OVERALL_FEEDBACK_KEY] || '';
  const overallDraft = draftMap[OVERALL_FEEDBACK_KEY] ?? overallSaved;
  const overallDirty = overallDraft !== overallSaved;

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
        <label htmlFor="responseSelect">Test response</label>
        <select
          id="responseSelect"
          value={selectValue}
          disabled={loading || !rows.length}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {!rows.length ? (
            <option value="">{loading ? 'Loading…' : 'No responses'}</option>
          ) : (
            rows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))
          )}
        </select>
        <button
          className="primary"
          type="button"
          disabled={loading}
          onClick={() => void loadResponses(selectedId || undefined)}
        >
          {loading ? 'Loading…' : 'Reload'}
        </button>
        <button type="button" onClick={expandAll} disabled={!sections.length}>
          Expand all
        </button>
        <button type="button" onClick={collapseAll} disabled={!sections.length}>
          Collapse all
        </button>
      </div>

      {plan && (
        <div className="meta">
          {selectedRow ? <span className="chip">{selectedRow.name}</span> : null}
          <span className="chip">
            Age {plan.ageStart ?? '?'}–{plan.ageEnd ?? '?'}
          </span>
          <span className="chip">{plan.status || 'Status unavailable'}</span>
          {schedule ? <span className="chip">{schedule}</span> : null}
          <span className="chip">{sections.length} sections</span>
        </div>
      )}

      <main className="page">
        {error && <div className="error">{error}</div>}
        {loading && !plan && <div className="empty">Loading lesson plan…</div>}
        {!loading && !plan && !error && (
          <div className="empty">No lesson plan found.</div>
        )}
        {!loading && selectedRow && !plan && (
          <div className="error">
            Could not parse lesson payload for “{selectedRow.name}”. Check the JSON in /admin.
          </div>
        )}

        {plan && (
          <>
            <h1 className="lesson-title">{plan.title || 'Untitled lesson plan'}</h1>
            <p className="lesson-desc">{plan.description || ''}</p>

            {sections.map((section, index) => {
              const key = sectionKeyOf(section, index);
              const items = parseDescription(section.description);
              const isCollapsed = !!collapsed[key];
              const saved = feedbackMap[key] || '';
              const draft = draftMap[key] ?? saved;
              const dirty = draft !== saved;

              return (
                <section key={key} className={`section${isCollapsed ? ' collapsed' : ''}`}>
                  <div className="section-head">
                    <div className="section-name">
                      <span>{ICONS[index % ICONS.length]}</span>
                      {section.title || 'Untitled section'}
                    </div>
                    <div className="actions">
                      {saved.trim() ? (
                        <span className="feedback-badge" title="Has feedback">
                          feedback
                        </span>
                      ) : null}
                      <button
                        className="action"
                        type="button"
                        aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                        onClick={() =>
                          setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                      >
                        {isCollapsed ? '⌄' : '⌃'}
                      </button>
                    </div>
                  </div>

                  <div className="section-body">
                    {items.length ? (
                      <ul>
                        {items.map((item, i) => (
                          <li key={`${key}-${i}`}>{item}</li>
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
                      <div className="feedback-label">
                        Section feedback
                        {saved.trim() ? <span className="feedback-badge">saved</span> : null}
                      </div>
                      <textarea
                        value={draft}
                        placeholder="name: your feedback here"
                        onChange={(e) =>
                          setDraftMap((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                      <div className="feedback-row">
                        <button
                          type="button"
                          disabled={savingKey === key || !dirty}
                          onClick={() => void saveFeedback(section, index)}
                        >
                          {savingKey === key ? 'Saving…' : 'Save feedback'}
                        </button>
                        <span className="feedback-note">
                          Hint: write as <b>name: feedback</b> to save
                        </span>
                      </div>
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
                <h3>Overall lesson plan feedback</h3>
                {overallSaved.trim() ? <span className="feedback-badge">saved</span> : null}
              </div>
              <p className="overall-feedback-desc">
                Share feedback on the whole lesson plan (not just one section).
              </p>
              <textarea
                value={overallDraft}
                placeholder="name: your overall feedback here"
                onChange={(e) =>
                  setDraftMap((prev) => ({
                    ...prev,
                    [OVERALL_FEEDBACK_KEY]: e.target.value,
                  }))
                }
              />
              <div className="feedback-row">
                <button
                  type="button"
                  disabled={savingKey === OVERALL_FEEDBACK_KEY || !overallDirty}
                  onClick={() => void saveOverallFeedback()}
                >
                  {savingKey === OVERALL_FEEDBACK_KEY ? 'Saving…' : 'Save overall feedback'}
                </button>
                <span className="feedback-note">
                  Hint: write as <b>name: feedback</b> to save
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

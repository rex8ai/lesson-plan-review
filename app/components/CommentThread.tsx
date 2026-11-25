'use client';

import { useState } from 'react';
import { COMMENT_LIMITS, type CommentRow } from '@/lib/types';

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  comments: CommentRow[];
  /** Resolves when the comment is saved; rejects with an Error to keep the draft. */
  onAdd: (body: string) => Promise<void>;
  onDelete: (comment: CommentRow) => Promise<void>;
  placeholder: string;
  submitLabel: string;
};

/**
 * A thread of saved comments plus an ALWAYS-EMPTY box for the next one.
 * The draft lives here and is only cleared after the server confirms the save,
 * so a failed request never loses what the reviewer typed.
 */
export default function CommentThread({
  comments,
  onAdd,
  onDelete,
  placeholder,
  submitLabel,
}: Props) {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const canSubmit = draft.trim().length > 0 && !busy;

  async function submit() {
    if (!canSubmit) return;
    setBusy(true);
    setLocalError(null);
    try {
      await onAdd(draft.trim());
      setDraft('');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Could not save comment');
    } finally {
      setBusy(false);
    }
  }

  async function remove(comment: CommentRow) {
    if (!confirm(`Delete ${comment.author}'s comment?`)) return;
    setLocalError(null);
    try {
      await onDelete(comment);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Could not delete comment');
    }
  }

  return (
    <div className="comments">
      {comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment">
              <div className="comment-head">
                <span className="comment-author">{comment.author}</span>
                <time className="comment-time" dateTime={comment.created_at}>
                  {formatWhen(comment.created_at)}
                </time>
                <button
                  type="button"
                  className="comment-delete"
                  aria-label={`Delete comment by ${comment.author}`}
                  title="Delete comment"
                  onClick={() => void remove(comment)}
                >
                  ×
                </button>
              </div>
              <p className="comment-body">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <textarea
        value={draft}
        maxLength={COMMENT_LIMITS.body}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            void submit();
          }
        }}
      />
      {localError && <div className="comment-error">{localError}</div>}
      <div className="feedback-row">
        <button type="button" disabled={!canSubmit} onClick={() => void submit()}>
          {busy ? 'Posting…' : submitLabel}
        </button>
        <span className="feedback-note">Ctrl/⌘ + Enter to post</span>
      </div>
    </div>
  );
}

import type { VersionRow } from '@/lib/types';

/** Sentinel value of a version dropdown: "＋ Create new version…". */
export const NEW_VERSION = '__new__';

/** fetch + JSON + error unwrapping shared by the client components. */
export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export function defaultResponseName() {
  return `response on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
}

/**
 * Resolves a version dropdown value to a real version id, creating the version first
 * when the "＋ Create new version…" option is selected.
 */
export async function ensureVersion(
  choice: string,
  newName: string,
  newDescription: string
): Promise<{ id: string; created: VersionRow | null }> {
  if (choice !== NEW_VERSION) {
    if (!choice) throw new Error('Choose a version');
    return { id: choice, created: null };
  }
  const created = await api<VersionRow>(
    '/api/versions',
    jsonInit('POST', { name: newName, description: newDescription })
  );
  return { id: created.id, created };
}

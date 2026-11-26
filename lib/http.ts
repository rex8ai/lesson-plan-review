import { NextResponse } from 'next/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

/** Maps common Postgres errors to useful HTTP statuses instead of a blanket 500. */
export function fail(err: unknown, fallback: string) {
  const code = (err as { code?: string } | null)?.code;
  if (code === '23505') {
    return NextResponse.json({ error: 'That name already exists' }, { status: 409 });
  }
  if (code === '23503') {
    return NextResponse.json({ error: 'Referenced version or response does not exist' }, { status: 400 });
  }
  if (code === '22P02') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const message = err instanceof Error ? err.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? (body as T) : null;
  } catch {
    return null;
  }
}

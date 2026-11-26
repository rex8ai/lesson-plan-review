import { NextResponse } from 'next/server';
import { badRequest, readJson } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Lesson generation can take minutes; this is the cap on Vercel, local dev has no cap. */
export const maxDuration = 300;

const UPSTREAM_TIMEOUT_MS = 290_000;
const METHODS = new Set(['GET', 'POST']);
/** Set by fetch itself; forwarding them breaks the request. */
const SKIPPED_HEADERS = new Set(['host', 'content-length', 'connection', 'transfer-encoding']);
/** Always set from the server env, so a client can never supply or override it. */
const API_KEY_HEADER = 'x-api-key';

/**
 * Both the base URL and the API key come from the server environment:
 *   LESSON_API_BASE_URL  e.g. http://localhost:5000
 *   LESSON_API_KEY       sent as the X-API-Key header
 * The browser only ever supplies a path under the base URL, so this route can't be
 * pointed at arbitrary hosts and the key never reaches the browser.
 */
function apiConfig() {
  const raw = (process.env.LESSON_API_BASE_URL || '').trim();
  let base: URL | null = null;
  try {
    base = raw ? new URL(raw) : null;
  } catch {
    base = null;
  }
  return {
    base: base && (base.protocol === 'http:' || base.protocol === 'https:') ? base : null,
    apiKey: (process.env.LESSON_API_KEY || '').trim(),
  };
}

/** Public, non-secret view of the config, used by the admin panel. */
export async function GET() {
  const { base, apiKey } = apiConfig();
  return NextResponse.json(
    {
      baseUrl: base ? base.origin : null,
      apiKeyConfigured: !!apiKey,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

type ProxyRequest = {
  /** Path under LESSON_API_BASE_URL, e.g. /cbse-lesson-plans/generate (optional ?query). */
  path?: string;
  method?: string;
  /** Extra headers. X-API-Key sent here is ignored; the server key is used instead. */
  headers?: Record<string, string>;
  body?: string;
};

export async function POST(req: Request) {
  const input = await readJson<ProxyRequest>(req);
  if (!input) return badRequest('Invalid JSON body');

  const { base, apiKey } = apiConfig();
  if (!base) {
    return NextResponse.json(
      { error: 'LESSON_API_BASE_URL is not set (or is not a valid http/https URL) on the server' },
      { status: 500 }
    );
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'LESSON_API_KEY is not set on the server' }, { status: 500 });
  }

  const path = String(input.path ?? '').trim();
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return badRequest('Path must start with / and be relative to the configured API base URL');
  }
  // Resolve against the configured base and make sure the origin did not change.
  const target = new URL(path, base);
  if (target.origin !== base.origin) {
    return badRequest('Path must stay on the configured API host');
  }

  const method = String(input.method ?? 'POST').toUpperCase();
  if (!METHODS.has(method)) return badRequest('Method must be GET or POST');

  let headers: Headers;
  try {
    headers = new Headers();
    for (const [name, value] of Object.entries(input.headers ?? {})) {
      const lower = name.toLowerCase();
      if (SKIPPED_HEADERS.has(lower) || lower === API_KEY_HEADER) continue;
      headers.set(name, String(value));
    }
    headers.set('X-API-Key', apiKey);
  } catch {
    return badRequest('One of the headers has an invalid name or value');
  }

  // Stop waiting if the browser gives up (Cancel button) or the upstream is too slow.
  const controller = new AbortController();
  const onClientAbort = () => controller.abort(new Error('cancelled'));
  req.signal.addEventListener('abort', onClientAbort);
  const timer = setTimeout(() => controller.abort(new Error('timeout')), UPSTREAM_TIMEOUT_MS);

  const started = Date.now();
  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body: method === 'GET' ? undefined : input.body,
      redirect: 'manual', // a redirect could leave the configured host
      cache: 'no-store',
      signal: controller.signal,
    });
    const body = await upstream.text();

    return NextResponse.json({
      status: upstream.status,
      statusText: upstream.statusText,
      ok: upstream.ok,
      contentType: upstream.headers.get('content-type') || '',
      durationMs: Date.now() - started,
      body,
    });
  } catch (err) {
    const reason = (controller.signal.reason as Error | undefined)?.message;
    if (reason === 'timeout') {
      return NextResponse.json(
        { error: `No response from ${base.host} within ${UPSTREAM_TIMEOUT_MS / 1000}s` },
        { status: 504 }
      );
    }
    if (reason === 'cancelled') {
      return NextResponse.json({ error: 'Cancelled' }, { status: 499 });
    }
    const cause = (err as { cause?: { code?: string; message?: string } }).cause;
    const detail = cause?.code || cause?.message || (err instanceof Error ? err.message : '');
    return NextResponse.json(
      { error: `Could not reach ${base.host}${detail ? ` (${detail})` : ''}` },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
    req.signal.removeEventListener('abort', onClientAbort);
  }
}

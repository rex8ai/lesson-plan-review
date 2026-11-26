import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { badRequest, fail, isUuid, readJson } from '@/lib/http';
import { validatePayload } from '@/lib/lesson';
import { ensureSchema } from '@/lib/schema';
import type { LessonResponseRow, ResponseSummary } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Lists responses WITHOUT their (large) payload; fetch /api/responses/[id] for that.
 * Optional `?versionId=` filters to one version. Order is stable (oldest first) so
 * editing a response never shuffles the dropdown reviewers are working from.
 */
export async function GET(req: Request) {
  try {
    await ensureSchema();
    const versionId = new URL(req.url).searchParams.get('versionId');
    if (versionId !== null && !isUuid(versionId)) return badRequest('Invalid versionId');

    const { rows } = await query<ResponseSummary>(
      `select r.id, r.name, r.version_id, r.created_at, r.updated_at,
              count(c.id)::int as comment_count
       from public.lesson_responses r
       left join public.feedback_comments c on c.response_id = r.id
       where ($1::uuid is null or r.version_id = $1::uuid)
       group by r.id
       order by r.created_at, r.name`,
      [versionId]
    );
    return NextResponse.json({ responses: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return fail(err, 'Failed to load responses');
  }
}

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await readJson<{ name?: string; payload?: unknown; versionId?: string }>(req);
    if (!body) return badRequest('Invalid JSON body');

    if (!isUuid(body.versionId)) return badRequest('versionId is required');
    if (body.payload === undefined) return badRequest('payload is required');
    const invalid = validatePayload(body.payload);
    if (invalid) return badRequest(invalid);

    const name = String(body.name ?? '').trim() || 'Untitled response';
    const { rows } = await query<LessonResponseRow>(
      `insert into public.lesson_responses (name, payload, version_id, updated_at)
       values ($1, $2::jsonb, $3, now())
       returning id, name, version_id, payload, created_at, updated_at`,
      [name, JSON.stringify(body.payload), body.versionId]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return fail(err, 'Failed to create response');
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { badRequest, fail, readJson } from '@/lib/http';
import { ensureSchema } from '@/lib/schema';
import { VERSION_LIMITS, type VersionRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const SELECT_VERSIONS = `
  select v.id, v.ordinal, v.name, v.description, v.created_at,
         count(r.id)::int as response_count
  from public.lesson_versions v
  left join public.lesson_responses r on r.version_id = v.id
  group by v.id
  order by v.ordinal`;

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query<VersionRow>(SELECT_VERSIONS);
    return NextResponse.json({ versions: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return fail(err, 'Failed to load versions');
  }
}

/** Creates the next version. A blank name becomes `v<next ordinal>`. */
export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await readJson<{ name?: string; description?: string }>(req);
    if (!body) return badRequest('Invalid JSON body');

    const name = String(body.name ?? '').trim();
    const description = String(body.description ?? '').trim();
    if (name.length > VERSION_LIMITS.name) {
      return badRequest(`Version name must be at most ${VERSION_LIMITS.name} characters`);
    }
    if (description.length > VERSION_LIMITS.description) {
      return badRequest(`Description must be at most ${VERSION_LIMITS.description} characters`);
    }

    const { rows } = await query<VersionRow>(
      `with next as (select coalesce(max(ordinal), -1) + 1 as ordinal from public.lesson_versions)
       insert into public.lesson_versions (ordinal, name, description)
       select next.ordinal, coalesce(nullif($1, ''), 'v' || next.ordinal), $2 from next
       returning id, ordinal, name, description, created_at, 0 as response_count`,
      [name, description]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return fail(err, 'Failed to create version');
  }
}

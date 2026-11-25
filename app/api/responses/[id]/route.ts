import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { badRequest, fail, isUuid, notFound, readJson, validatePayload } from '@/lib/http';
import { ensureSchema } from '@/lib/schema';
import type { LessonResponseRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

const COLUMNS = 'id, name, version_id, payload, created_at, updated_at';

export async function GET(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const { rows } = await query<LessonResponseRow>(
      `select ${COLUMNS} from public.lesson_responses where id = $1`,
      [id]
    );
    if (!rows.length) return notFound();
    return NextResponse.json(rows[0], { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return fail(err, 'Failed to load response');
  }
}

/** Partial update: any of name / payload / versionId (move to another version). */
export async function PUT(req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const body = await readJson<{ name?: string; payload?: unknown; versionId?: string }>(req);
    if (!body) return badRequest('Invalid JSON body');

    const fields: string[] = [];
    const values: unknown[] = [];

    if (body.name !== undefined) {
      values.push(String(body.name).trim() || 'Untitled response');
      fields.push(`name = $${values.length}`);
    }
    if (body.payload !== undefined) {
      const invalid = validatePayload(body.payload);
      if (invalid) return badRequest(invalid);
      values.push(JSON.stringify(body.payload));
      fields.push(`payload = $${values.length}::jsonb`);
    }
    if (body.versionId !== undefined) {
      if (!isUuid(body.versionId)) return badRequest('Invalid versionId');
      values.push(body.versionId);
      fields.push(`version_id = $${values.length}`);
    }
    if (!fields.length) return badRequest('Nothing to update');

    fields.push('updated_at = now()');
    values.push(id);

    const { rows } = await query<LessonResponseRow>(
      `update public.lesson_responses
       set ${fields.join(', ')}
       where id = $${values.length}
       returning ${COLUMNS}`,
      values
    );
    if (!rows.length) return notFound();
    return NextResponse.json(rows[0]);
  } catch (err) {
    return fail(err, 'Failed to update response');
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const { rowCount } = await query(`delete from public.lesson_responses where id = $1`, [id]);
    if (!rowCount) return notFound();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err, 'Failed to delete response');
  }
}

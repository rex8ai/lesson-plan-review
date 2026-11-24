import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureSchema } from '@/lib/schema';
import type { LessonResponseRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    const { rows } = await query<LessonResponseRow>(
      `select id, name, payload, created_at, updated_at
       from public.lesson_responses
       where id = $1`,
      [id]
    );
    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    const body = (await req.json()) as { name?: string; payload?: unknown };

    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (body.name !== undefined) {
      fields.push(`name = $${i++}`);
      values.push(String(body.name).trim() || 'Untitled response');
    }
    if (body.payload !== undefined) {
      fields.push(`payload = $${i++}::jsonb`);
      values.push(JSON.stringify(body.payload));
    }

    if (!fields.length) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    fields.push('updated_at = now()');
    values.push(id);

    const { rows } = await query<LessonResponseRow>(
      `update public.lesson_responses
       set ${fields.join(', ')}
       where id = $${i}
       returning id, name, payload, created_at, updated_at`,
      values
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    const { rowCount } = await query(`delete from public.lesson_responses where id = $1`, [id]);
    if (!rowCount) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

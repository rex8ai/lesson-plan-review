import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureSchema } from '@/lib/schema';
import type { LessonResponseRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query<LessonResponseRow>(
      `select id, name, payload, created_at, updated_at
       from public.lesson_responses
       order by updated_at desc, created_at desc`
    );
    return NextResponse.json(
      { responses: rows },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load responses';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = (await req.json()) as { name?: string; payload?: unknown };
    const name = String(body.name ?? '').trim() || 'Untitled response';
    if (body.payload === undefined) {
      return NextResponse.json({ error: 'payload is required' }, { status: 400 });
    }

    const { rows } = await query<LessonResponseRow>(
      `insert into public.lesson_responses (name, payload, updated_at)
       values ($1, $2::jsonb, now())
       returning id, name, payload, created_at, updated_at`,
      [name, JSON.stringify(body.payload)]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

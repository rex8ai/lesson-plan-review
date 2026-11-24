import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureSchema } from '@/lib/schema';
import type { SectionFeedbackRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ responseId: string; sectionKey: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { responseId, sectionKey: rawSectionKey } = await params;
    const sectionKey = decodeURIComponent(rawSectionKey);
    const body = (await req.json()) as { feedback?: string; sectionTitle?: string };
    const feedback = String(body.feedback ?? '');
    const sectionTitle = body.sectionTitle ?? null;

    const { rows } = await query<SectionFeedbackRow>(
      `insert into public.section_feedback
         (response_id, section_key, section_title, feedback, updated_at)
       values ($1, $2, $3, $4, now())
       on conflict (response_id, section_key) do update
         set feedback = excluded.feedback,
             section_title = coalesce(excluded.section_title, public.section_feedback.section_title),
             updated_at = now()
       returning id, response_id, section_key, section_title, feedback, updated_at`,
      [responseId, sectionKey, sectionTitle, feedback]
    );

    return NextResponse.json(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save feedback';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

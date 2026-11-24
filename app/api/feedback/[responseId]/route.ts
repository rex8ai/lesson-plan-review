import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureSchema } from '@/lib/schema';
import type { SectionFeedbackRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ responseId: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { responseId } = await params;
    const { rows } = await query<SectionFeedbackRow>(
      `select id, response_id, section_key, section_title, feedback, updated_at
       from public.section_feedback
       where response_id = $1
       order by section_key`,
      [responseId]
    );
    return NextResponse.json({ feedback: rows });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load feedback';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

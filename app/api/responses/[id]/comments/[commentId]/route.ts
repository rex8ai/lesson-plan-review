import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fail, isUuid, notFound } from '@/lib/http';
import { ensureSchema } from '@/lib/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ id: string; commentId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id, commentId } = await params;
    if (!isUuid(id) || !isUuid(commentId)) return notFound();

    const { rowCount } = await query(
      `delete from public.feedback_comments where id = $1 and response_id = $2`,
      [commentId, id]
    );
    if (!rowCount) return notFound();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err, 'Failed to delete comment');
  }
}

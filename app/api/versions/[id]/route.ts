import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fail, isUuid, notFound } from '@/lib/http';
import { ensureSchema } from '@/lib/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

/** Only an empty, non-initial version can be removed — never silently drop reviewed data. */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const { rows } = await query<{ ordinal: number; response_count: number }>(
      `select v.ordinal, count(r.id)::int as response_count
       from public.lesson_versions v
       left join public.lesson_responses r on r.version_id = v.id
       where v.id = $1
       group by v.id`,
      [id]
    );
    if (!rows.length) return notFound();
    if (rows[0].ordinal === 0) {
      return NextResponse.json({ error: 'v0 cannot be deleted' }, { status: 409 });
    }
    if (rows[0].response_count > 0) {
      return NextResponse.json(
        { error: 'Move or delete the responses in this version first' },
        { status: 409 }
      );
    }

    await query(`delete from public.lesson_versions where id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err, 'Failed to delete version');
  }
}

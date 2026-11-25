import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { badRequest, fail, isUuid, notFound, readJson } from '@/lib/http';
import { ensureSchema } from '@/lib/schema';
import { COMMENT_LIMITS, type CommentRow } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

const COLUMNS = 'id, response_id, section_key, section_title, author, body, created_at';

/** All comments for one response (sections + overall), oldest first. */
export async function GET(_req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const { rows } = await query<CommentRow>(
      `select ${COLUMNS} from public.feedback_comments
       where response_id = $1
       order by created_at, id`,
      [id]
    );
    return NextResponse.json({ comments: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return fail(err, 'Failed to load comments');
  }
}

/** Adds a new comment. Comments are append-only, so the input box is always empty. */
export async function POST(req: Request, { params }: Params) {
  try {
    await ensureSchema();
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const input = await readJson<{
      sectionKey?: string;
      sectionTitle?: string | null;
      author?: string;
      body?: string;
    }>(req);
    if (!input) return badRequest('Invalid JSON body');

    const sectionKey = String(input.sectionKey ?? '').trim();
    const body = String(input.body ?? '').trim();
    const author = String(input.author ?? '').trim() || 'Anonymous';
    const sectionTitle = input.sectionTitle ? String(input.sectionTitle).slice(0, 200) : null;

    if (!sectionKey || sectionKey.length > 200) return badRequest('sectionKey is required');
    if (!body) return badRequest('Comment cannot be empty');
    if (body.length > COMMENT_LIMITS.body) {
      return badRequest(`Comment must be at most ${COMMENT_LIMITS.body} characters`);
    }
    if (author.length > COMMENT_LIMITS.author) {
      return badRequest(`Name must be at most ${COMMENT_LIMITS.author} characters`);
    }

    const { rows } = await query<CommentRow>(
      `insert into public.feedback_comments (response_id, section_key, section_title, author, body)
       select id, $2, $3, $4, $5 from public.lesson_responses where id = $1
       returning ${COLUMNS}`,
      [id, sectionKey, sectionTitle, author, body]
    );
    if (!rows.length) return notFound('Response not found');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return fail(err, 'Failed to save comment');
  }
}

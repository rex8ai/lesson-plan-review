import { query } from '@/lib/db';

declare global {
  // eslint-disable-next-line no-var
  var __lessonSchemaReady: Promise<void> | undefined;
}

async function columnExists(table: string, column: string) {
  const { rows } = await query<{ exists: boolean }>(
    `select exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = $1 and column_name = $2
     ) as exists`,
    [table, column]
  );
  return !!rows[0]?.exists;
}

async function tableExists(table: string) {
  const { rows } = await query<{ exists: boolean }>(
    `select exists (
       select 1 from information_schema.tables
       where table_schema = 'public' and table_name = $1
     ) as exists`,
    [table]
  );
  return !!rows[0]?.exists;
}

async function migrateSchema() {
  await query(`
    create table if not exists public.lesson_responses (
      id uuid primary key default gen_random_uuid(),
      name text not null default 'Untitled response',
      payload jsonb not null default '[]'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  if (await columnExists('lesson_responses', 'response_key')) {
    await query(`alter table public.lesson_responses add column if not exists name text`);
    await query(`
      update public.lesson_responses
      set name = coalesce(nullif(label, ''), response_key, 'Untitled response')
      where name is null or btrim(name) = ''
    `);
    await query(`alter table public.lesson_responses alter column name set not null`);
    await query(`alter table public.lesson_responses alter column name set default 'Untitled response'`);

    if (
      (await tableExists('section_feedback')) &&
      (await columnExists('section_feedback', 'response_key'))
    ) {
      await query(`
        create table if not exists public.section_feedback_v2 (
          id uuid primary key default gen_random_uuid(),
          response_id uuid not null references public.lesson_responses(id) on delete cascade,
          section_key text not null,
          section_title text,
          feedback text not null default '',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          unique (response_id, section_key)
        )
      `);
      await query(`
        insert into public.section_feedback_v2
          (id, response_id, section_key, section_title, feedback, created_at, updated_at)
        select sf.id, lr.id, sf.section_key, sf.section_title, sf.feedback, sf.created_at, sf.updated_at
        from public.section_feedback sf
        join public.lesson_responses lr on lr.response_key = sf.response_key
        on conflict do nothing
      `);
      await query(`drop table public.section_feedback`);
      await query(`alter table public.section_feedback_v2 rename to section_feedback`);
    }

    await query(`alter table public.lesson_responses drop constraint if exists lesson_responses_response_key_key`);
    await query(`alter table public.lesson_responses drop column if exists response_key`);
    await query(`alter table public.lesson_responses drop column if exists label`);
  }

  if (!(await columnExists('lesson_responses', 'name'))) {
    await query(
      `alter table public.lesson_responses add column name text not null default 'Untitled response'`
    );
  }

  await query(`
    create table if not exists public.section_feedback (
      id uuid primary key default gen_random_uuid(),
      response_id uuid not null references public.lesson_responses(id) on delete cascade,
      section_key text not null,
      section_title text,
      feedback text not null default '',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique (response_id, section_key)
    );
  `);

  await query(`
    alter table public.lesson_responses enable row level security;
    alter table public.section_feedback enable row level security;
  `);

  await query(`
    drop policy if exists lesson_responses_select on public.lesson_responses;
    drop policy if exists lesson_responses_insert on public.lesson_responses;
    drop policy if exists lesson_responses_update on public.lesson_responses;
    drop policy if exists lesson_responses_delete on public.lesson_responses;
    create policy lesson_responses_select on public.lesson_responses for select to anon, authenticated using (true);
    create policy lesson_responses_insert on public.lesson_responses for insert to anon, authenticated with check (true);
    create policy lesson_responses_update on public.lesson_responses for update to anon, authenticated using (true) with check (true);
    create policy lesson_responses_delete on public.lesson_responses for delete to anon, authenticated using (true);

    drop policy if exists section_feedback_select on public.section_feedback;
    drop policy if exists section_feedback_insert on public.section_feedback;
    drop policy if exists section_feedback_update on public.section_feedback;
    drop policy if exists section_feedback_delete on public.section_feedback;
    create policy section_feedback_select on public.section_feedback for select to anon, authenticated using (true);
    create policy section_feedback_insert on public.section_feedback for insert to anon, authenticated with check (true);
    create policy section_feedback_update on public.section_feedback for update to anon, authenticated using (true) with check (true);
    create policy section_feedback_delete on public.section_feedback for delete to anon, authenticated using (true);

    grant select, insert, update, delete on public.lesson_responses to anon, authenticated;
    grant select, insert, update, delete on public.section_feedback to anon, authenticated;
  `);
}

/** Ensures schema once per server process (safe under concurrent requests). */
export function ensureSchema() {
  if (!global.__lessonSchemaReady) {
    global.__lessonSchemaReady = migrateSchema().catch((err) => {
      global.__lessonSchemaReady = undefined;
      throw err;
    });
  }
  return global.__lessonSchemaReady;
}

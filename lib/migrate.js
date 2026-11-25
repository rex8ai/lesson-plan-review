/**
 * Schema migration, shared by the Next.js app (lib/schema.ts) and scripts/seed.js.
 *
 * `migrate(client)` expects a single connected pg client that is already inside a
 * transaction (the caller handles BEGIN / COMMIT / ROLLBACK and the advisory lock),
 * and every step is idempotent so it is safe to run on every cold start.
 *
 * Data model
 *   lesson_versions   – a named batch of responses (v0, v1, …). v0 always exists and
 *                       holds everything that was created before versioning.
 *   lesson_responses  – one stored API response, always belongs to exactly one version.
 *   feedback_comments – append-only comments on a section (or the whole lesson plan,
 *                       section_key = '__overall__'). Replaces the old one-row-per
 *                       section `section_feedback` table.
 */

const OVERALL_KEY = '__overall__';
const INITIAL_VERSION_NAME = 'v0';

async function exists(client, sql, params) {
  const { rows } = await client.query(sql, params);
  return !!rows[0]?.exists;
}

const columnExists = (client, table, column) =>
  exists(
    client,
    `select exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = $1 and column_name = $2
     ) as exists`,
    [table, column]
  );

const tableExists = (client, table) =>
  exists(client, `select to_regclass('public.' || $1) is not null as exists`, [table]);

/** Pre-UUID installs keyed responses by `response_key`; fold them into the current shape. */
async function upgradeLegacyKeys(client) {
  if (!(await columnExists(client, 'lesson_responses', 'response_key'))) return;

  await client.query(`alter table public.lesson_responses add column if not exists name text`);
  await client.query(`
    update public.lesson_responses
    set name = coalesce(nullif(label, ''), response_key, 'Untitled response')
    where name is null or btrim(name) = ''
  `);
  await client.query(`alter table public.lesson_responses alter column name set not null`);
  await client.query(
    `alter table public.lesson_responses alter column name set default 'Untitled response'`
  );

  if (
    (await tableExists(client, 'section_feedback')) &&
    (await columnExists(client, 'section_feedback', 'response_key'))
  ) {
    await client.query(`
      create table public.section_feedback_v2 (
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
    await client.query(`
      insert into public.section_feedback_v2
        (id, response_id, section_key, section_title, feedback, created_at, updated_at)
      select sf.id, lr.id, sf.section_key, sf.section_title, sf.feedback, sf.created_at, sf.updated_at
      from public.section_feedback sf
      join public.lesson_responses lr on lr.response_key = sf.response_key
      on conflict do nothing
    `);
    await client.query(`drop table public.section_feedback`);
    await client.query(`alter table public.section_feedback_v2 rename to section_feedback`);
  }

  await client.query(
    `alter table public.lesson_responses drop constraint if exists lesson_responses_response_key_key`
  );
  await client.query(`alter table public.lesson_responses drop column if exists response_key`);
  await client.query(`alter table public.lesson_responses drop column if exists label`);
}

/**
 * The old model stored ONE editable text per section (often "name: feedback").
 * Turn every non-empty row into a comment, then keep the old table around, renamed,
 * so nothing is ever lost.
 */
async function migrateSectionFeedbackToComments(client) {
  if (!(await tableExists(client, 'section_feedback'))) return;
  if (await tableExists(client, 'section_feedback_legacy')) return;

  await client.query(`
    insert into public.feedback_comments
      (response_id, section_key, section_title, author, body, created_at)
    select
      sf.response_id,
      sf.section_key,
      sf.section_title,
      coalesce(nullif(btrim(m[1]), ''), 'Anonymous'),
      btrim(coalesce(m[2], sf.feedback)),
      sf.updated_at
    from public.section_feedback sf
    left join lateral regexp_match(sf.feedback, '^\\s*([^:\\n]{1,40}):\\s*([\\s\\S]+)$') as m on true
    where btrim(sf.feedback) <> ''
    order by sf.updated_at
  `);
  await client.query(`alter table public.section_feedback rename to section_feedback_legacy`);
}

async function migrate(client) {
  await client.query(`
    create table if not exists public.lesson_responses (
      id uuid primary key default gen_random_uuid(),
      name text not null default 'Untitled response',
      payload jsonb not null default '[]'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
  await upgradeLegacyKeys(client);

  // ── versions ───────────────────────────────────────────────────────────────
  await client.query(`
    create table if not exists public.lesson_versions (
      id uuid primary key default gen_random_uuid(),
      ordinal integer not null unique check (ordinal >= 0),
      name text not null check (btrim(name) <> ''),
      description text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await client.query(
    `create unique index if not exists lesson_versions_name_key on public.lesson_versions (lower(name))`
  );
  await client.query(
    `insert into public.lesson_versions (ordinal, name, description)
     values (0, $1, 'Responses created before versioning was introduced')
     on conflict (ordinal) do nothing`,
    [INITIAL_VERSION_NAME]
  );

  await client.query(`
    alter table public.lesson_responses
      add column if not exists version_id uuid references public.lesson_versions(id) on delete restrict
  `);
  await client.query(`
    update public.lesson_responses
    set version_id = (select id from public.lesson_versions where ordinal = 0)
    where version_id is null
  `);
  await client.query(`alter table public.lesson_responses alter column version_id set not null`);
  await client.query(
    `create index if not exists lesson_responses_version_idx
       on public.lesson_responses (version_id, created_at)`
  );

  // ── comments ───────────────────────────────────────────────────────────────
  await client.query(`
    create table if not exists public.feedback_comments (
      id uuid primary key default gen_random_uuid(),
      response_id uuid not null references public.lesson_responses(id) on delete cascade,
      section_key text not null check (btrim(section_key) <> ''),
      section_title text,
      author text not null default 'Anonymous',
      body text not null check (btrim(body) <> ''),
      created_at timestamptz not null default now()
    )
  `);
  await client.query(
    `create index if not exists feedback_comments_response_idx
       on public.feedback_comments (response_id, section_key, created_at)`
  );
  await migrateSectionFeedbackToComments(client);

  // ── access ─────────────────────────────────────────────────────────────────
  // The app talks to Postgres directly (owner role), so the new tables need no
  // PostgREST access: RLS on, no policies, no anon/authenticated grants.
  await client.query(`
    alter table public.lesson_versions enable row level security;
    alter table public.feedback_comments enable row level security;
  `);
}

module.exports = { migrate, OVERALL_KEY, INITIAL_VERSION_NAME };

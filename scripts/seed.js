#!/usr/bin/env node
/**
 * Seeds lesson_responses in Supabase from lesson-data.js (JSON payloads as-is).
 * Uses DATABASE_URL from .env.local / environment.
 * Each response gets a UUID id; name is a free-form label.
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function query(text, params) {
  return pool.query(text, params);
}

async function columnExists(table, column) {
  const { rows } = await query(
    `select exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = $1 and column_name = $2
     ) as exists`,
    [table, column]
  );
  return !!rows[0]?.exists;
}

async function ensureSchema() {
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
    await query(`alter table public.lesson_responses drop constraint if exists lesson_responses_response_key_key`);
    await query(`alter table public.lesson_responses drop column if exists response_key`);
    await query(`alter table public.lesson_responses drop column if exists label`);
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
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Copy .env.example to .env.local');
  }

  await ensureSchema();

  const src = fs.readFileSync(path.join(__dirname, '..', 'lesson-data.js'), 'utf8');
  // eslint-disable-next-line no-eval
  eval(src.replace('window.LESSON_PLAN_RESPONSES', 'globalThis.LESSON_PLAN_RESPONSES'));
  const responses = globalThis.LESSON_PLAN_RESPONSES;

  for (const [legacyKey, payload] of Object.entries(responses)) {
    const plans = Array.isArray(payload) ? payload : [payload];
    const plan = plans[0] || {};
    const name = `${legacyKey} — ${plan.title || 'Lesson'} (Age ${plan.ageStart ?? '?'}–${plan.ageEnd ?? '?'})`;

    // Upsert by exact name so re-seeding does not duplicate the demo set
    const existing = await query(`select id from public.lesson_responses where name = $1 limit 1`, [
      name,
    ]);
    if (existing.rows.length) {
      await query(
        `update public.lesson_responses
         set payload = $2::jsonb, updated_at = now()
         where id = $1`,
        [existing.rows[0].id, JSON.stringify(payload)]
      );
      console.log('updated', name);
    } else {
      await query(
        `insert into public.lesson_responses (name, payload, updated_at)
         values ($1, $2::jsonb, now())`,
        [name, JSON.stringify(payload)]
      );
      console.log('created', name);
    }
  }

  const { rows } = await query(
    `select id, name from public.lesson_responses order by updated_at desc`
  );
  console.log('done', rows.length, 'responses');
  console.table(rows.map((r) => ({ id: r.id, name: r.name })));
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

#!/usr/bin/env node
/**
 * Seeds the demo responses from lesson-data.js into version v0 (JSON payloads as-is).
 * Uses DATABASE_URL from .env.local / environment and the same migration as the app,
 * so it is safe to run against a fresh or an existing database.
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { migrate } = require('../lib/migrate');

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

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Copy .env.example to .env.local');
  }

  const src = fs.readFileSync(path.join(__dirname, '..', 'lesson-data.js'), 'utf8');
  // eslint-disable-next-line no-eval
  eval(src.replace('window.LESSON_PLAN_RESPONSES', 'globalThis.LESSON_PLAN_RESPONSES'));
  const responses = globalThis.LESSON_PLAN_RESPONSES;

  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query('select pg_advisory_xact_lock(726001)'); // same lock as the app
    await migrate(client);

    const {
      rows: [v0],
    } = await client.query(`select id from public.lesson_versions where ordinal = 0`);

    for (const [legacyKey, payload] of Object.entries(responses)) {
      const plans = Array.isArray(payload) ? payload : [payload];
      const plan = plans[0] || {};
      const name = `${legacyKey} — ${plan.title || 'Lesson'} (Age ${plan.ageStart ?? '?'}–${plan.ageEnd ?? '?'})`;

      // Upsert by (version, name) so re-seeding does not duplicate the demo set
      const existing = await client.query(
        `select id from public.lesson_responses where version_id = $1 and name = $2 limit 1`,
        [v0.id, name]
      );
      if (existing.rows.length) {
        await client.query(
          `update public.lesson_responses set payload = $2::jsonb, updated_at = now() where id = $1`,
          [existing.rows[0].id, JSON.stringify(payload)]
        );
        console.log('updated', name);
      } else {
        await client.query(
          `insert into public.lesson_responses (name, payload, version_id, updated_at)
           values ($1, $2::jsonb, $3, now())`,
          [name, JSON.stringify(payload), v0.id]
        );
        console.log('created', name);
      }
    }
    await client.query('commit');
  } catch (err) {
    await client.query('rollback').catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }

  const { rows } = await pool.query(
    `select v.name as version, r.id, r.name
     from public.lesson_responses r
     join public.lesson_versions v on v.id = r.version_id
     order by v.ordinal, r.created_at`
  );
  console.log('done', rows.length, 'responses');
  console.table(rows);
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

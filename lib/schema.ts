import { getPool } from '@/lib/db';
import { migrate } from '@/lib/migrate';

declare global {
  // eslint-disable-next-line no-var
  var __lessonSchemaReady: Promise<void> | undefined;
}

/** Arbitrary constant: serialises migrations across concurrent serverless instances. */
const MIGRATION_LOCK_ID = 726_001;

async function runMigration() {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    await client.query('select pg_advisory_xact_lock($1)', [MIGRATION_LOCK_ID]);
    await migrate(client);
    await client.query('commit');
  } catch (err) {
    await client.query('rollback').catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

/** Ensures schema once per server process (safe under concurrent requests). */
export function ensureSchema() {
  if (!global.__lessonSchemaReady) {
    global.__lessonSchemaReady = runMigration().catch((err) => {
      global.__lessonSchemaReady = undefined;
      throw err;
    });
  }
  return global.__lessonSchemaReady;
}

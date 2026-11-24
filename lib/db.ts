import { Pool, type QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __lessonPgPool: Pool | undefined;
}

/**
 * Serverless-friendly Postgres pool for Vercel + Supabase.
 * Use the Supabase transaction pooler URL in DATABASE_URL.
 */
function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const isDev = process.env.NODE_ENV !== 'production';

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    // Dev needs a bit more concurrency (React Strict Mode double-fetches).
    // Vercel serverless should stay at 1 connection per isolate.
    max: isDev ? 5 : 1,
    idleTimeoutMillis: isDev ? 30_000 : 5_000,
    connectionTimeoutMillis: 15_000,
    allowExitOnIdle: !isDev,
  });
}

export function getPool() {
  if (!global.__lessonPgPool) {
    global.__lessonPgPool = createPool();
  }
  return global.__lessonPgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return getPool().query<T>(text, params);
}

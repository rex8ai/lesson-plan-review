import type { PoolClient } from 'pg';

export function migrate(client: Pick<PoolClient, 'query'>): Promise<void>;
export const OVERALL_KEY: string;
export const INITIAL_VERSION_NAME: string;

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DbProvider = {
  provide: 'DB',
  useFactory: () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return drizzle(pool, { schema });
  },
};

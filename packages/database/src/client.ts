import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema/index';

// Initialize a generic in-memory DB by default, or connect to a path provided at runtime
let sqlite = new Database(':memory:');
export let db = drizzle(sqlite, { schema });

export const initDb = (dbPath: string) => {
  sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
};

import { MigrationError } from "./persistence-errors";

export interface Migration {
  readonly version: number;
  readonly description: string;
  up(db: DatabaseConnection): Promise<void>;
  down(db: DatabaseConnection): Promise<void>;
}

/**
 * Minimal database connection contract.
 * Abstracts away the specific SQLite driver (e.g. better-sqlite3, sql.js).
 */
export interface DatabaseConnection {
  execute(sql: string, params?: unknown[]): Promise<void>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  queryOne<T>(sql: string, params?: unknown[]): Promise<T | undefined>;
}

export class MigrationRunner {
  private migrations: Migration[] = [];

  public register(migration: Migration): void {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  public async runAll(db: DatabaseConnection): Promise<void> {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version     INTEGER PRIMARY KEY,
        description TEXT    NOT NULL DEFAULT '',
        checksum    TEXT    NOT NULL DEFAULT '',
        applied_at  TEXT    NOT NULL
      )
    `);

    for (const migration of this.migrations) {
      const existing = await db.queryOne<{ version: number }>(
        "SELECT version FROM schema_migrations WHERE version = ?",
        [migration.version]
      );

      if (existing) continue;

      try {
        await migration.up(db);
        await db.execute(
          "INSERT INTO schema_migrations (version, description, checksum, applied_at) VALUES (?, ?, ?, ?)",
          [migration.version, migration.description, "", new Date().toISOString()]
        );
        console.log(`[Migration] Applied v${migration.version}: ${migration.description}`);
      } catch (error: unknown) {
        const cause = error instanceof Error ? error.message : String(error);
        throw new MigrationError(migration.version, cause);
      }
    }
  }
}

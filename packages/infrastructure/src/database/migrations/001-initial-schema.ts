import { Migration, DatabaseConnection } from "../migration-runner";

/**
 * Initial schema — creates all core tables.
 */
export const initialSchemaMigration: Migration = {
  version: 1,
  description: "Initial schema: projects, assets, timelines, schema_migrations",

  async up(db: DatabaseConnection): Promise<void> {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id          TEXT    PRIMARY KEY,
        name        TEXT    NOT NULL,
        description TEXT    NOT NULL DEFAULT '',
        workspace_id TEXT   NOT NULL,
        created_at  TEXT    NOT NULL,
        updated_at  TEXT    NOT NULL,
        version     INTEGER NOT NULL DEFAULT 1
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS assets (
        id         TEXT    PRIMARY KEY,
        name       TEXT    NOT NULL,
        file_path  TEXT    NOT NULL,
        mime_type  TEXT    NOT NULL,
        size_bytes INTEGER NOT NULL,
        project_id TEXT    NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        created_at TEXT    NOT NULL
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS timelines (
        id         TEXT    PRIMARY KEY,
        project_id TEXT    NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        duration_ms INTEGER NOT NULL DEFAULT 0,
        frame_rate  REAL    NOT NULL DEFAULT 24.0,
        created_at  TEXT    NOT NULL,
        updated_at  TEXT    NOT NULL,
        version     INTEGER NOT NULL DEFAULT 1
      )
    `);
  },

  async down(db: DatabaseConnection): Promise<void> {
    await db.execute("DROP TABLE IF EXISTS timelines");
    await db.execute("DROP TABLE IF EXISTS assets");
    await db.execute("DROP TABLE IF EXISTS projects");
  }
};

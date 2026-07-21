/**
 * SQLite engine configuration.
 * Paths and policies are injected via config — never hardcoded.
 */
export type DatabaseEnvironment = "production" | "development" | "test";

export interface DatabaseConfig {
  /** Absolute path to the .db file, or ":memory:" for in-memory (test). */
  readonly path: string;
  readonly environment: DatabaseEnvironment;
  /** WAL mode enabled by default for better concurrency & crash recovery. */
  readonly walMode: boolean;
  /** Milliseconds before giving up on a locked DB. */
  readonly busyTimeoutMs: number;
  /** Whether foreign key constraints are enforced at the connection level. */
  readonly foreignKeys: boolean;
  /** Automatic integrity check on startup. */
  readonly integrityCheckOnStartup: boolean;
  /** Automatic backup before migrations. */
  readonly backupBeforeMigrations: boolean;
}

export const DEFAULT_DATABASE_CONFIG: DatabaseConfig = {
  path: ":memory:",
  environment: "development",
  walMode: true,
  busyTimeoutMs: 5000,
  foreignKeys: true,
  integrityCheckOnStartup: true,
  backupBeforeMigrations: true,
};

export function buildProductionConfig(userDataDir: string): DatabaseConfig {
  return {
    ...DEFAULT_DATABASE_CONFIG,
    path: `${userDataDir}/project.db`,
    environment: "production",
  };
}

export function buildTestConfig(): DatabaseConfig {
  return {
    ...DEFAULT_DATABASE_CONFIG,
    path: ":memory:",
    environment: "test",
    backupBeforeMigrations: false,
    integrityCheckOnStartup: false,
  };
}

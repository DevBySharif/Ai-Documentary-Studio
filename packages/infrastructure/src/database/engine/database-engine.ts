import { DatabaseConnection, MigrationRunner } from "../migration-runner";
import { DatabaseConfig } from "./database-config";
import { ConnectionManager } from "./connection-manager";
import { IntegrityChecker, IntegrityReport } from "./integrity-checker";
import { BackupManager } from "./backup-manager";
import { DatabaseMetricsCollector } from "./database-metrics";
import { ConnectionError } from "../persistence-errors";
import { initialSchemaMigration } from "../migrations/001-initial-schema";

export interface DatabaseEngineStatus {
  path: string;
  schemaVersion: number;
  integrityReport: IntegrityReport | null;
  ready: boolean;
}

/**
 * The top-level database engine.
 * Orchestrates the full deterministic startup lifecycle:
 *   Open → Configure → Integrity Check → Backup → Migrate → Validate → Ready
 */
export class DatabaseEngine {
  private readonly connectionManager: ConnectionManager;
  private readonly integrityChecker: IntegrityChecker;
  private readonly backupManager: BackupManager;
  private readonly migrationRunner: MigrationRunner;
  private readonly metrics = new DatabaseMetricsCollector();

  private schemaVersion = 0;
  private isReady = false;

  constructor(
    private readonly db: DatabaseConnection,
    private readonly config: DatabaseConfig
  ) {
    this.connectionManager = new ConnectionManager(db, config);
    this.integrityChecker = new IntegrityChecker(db);
    this.backupManager = new BackupManager(db);
    this.migrationRunner = new MigrationRunner();

    // Register all migrations in version order
    this.migrationRunner.register(initialSchemaMigration);
  }

  /**
   * Executes the full deterministic startup sequence.
   * Throws a ConnectionError if any critical step fails — startup halts.
   */
  public async initialize(): Promise<DatabaseEngineStatus> {
    console.log(`[DatabaseEngine] Initializing: ${this.config.path}`);

    // Step 1: Open and configure the connection (pragmas)
    await this.connectionManager.open();

    // Step 2: Integrity check
    let integrityReport: IntegrityReport | null = null;
    if (this.config.integrityCheckOnStartup) {
      const start = Date.now();
      integrityReport = await this.integrityChecker.check();
      this.metrics.recordIntegrityCheck(Date.now() - start);

      if (integrityReport.status === "Failed") {
        throw new ConnectionError(
          `Database failed integrity check: ${integrityReport.details ?? "unknown"}`
        );
      }
    }

    // Step 3: Pre-migration backup (production only)
    if (
      this.config.backupBeforeMigrations &&
      this.config.environment === "production" &&
      this.config.path !== ":memory:"
    ) {
      const backupPath = BackupManager.buildBackupPath(this.config.path);
      const start = Date.now();
      await this.backupManager.backup(
        this.config.path,
        backupPath,
        this.schemaVersion
      );
      this.metrics.recordBackup(Date.now() - start);
    }

    // Step 4: Run pending migrations
    await this.migrationRunner.runAll(this.db);

    // Step 5: Read current schema version from migration metadata table
    const versionRow = await this.db.queryOne<{ version: number }>(
      "SELECT MAX(version) AS version FROM schema_migrations"
    );
    this.schemaVersion = versionRow?.version ?? 0;
    this.metrics.setSchemaVersion(this.schemaVersion);

    this.isReady = true;

    const status: DatabaseEngineStatus = {
      path: this.config.path,
      schemaVersion: this.schemaVersion,
      integrityReport,
      ready: true,
    };

    console.log(
      `[DatabaseEngine] Ready — schema v${this.schemaVersion}, path: ${this.config.path}`
    );

    return status;
  }

  public getMetrics() {
    return {
      ...this.connectionManager.getMetrics(),
      ...this.metrics.collect(),
    };
  }

  public get ready(): boolean {
    return this.isReady;
  }
}

import { DatabaseConnection } from "../migration-runner";
import { DatabaseConfig } from "./database-config";
import { DatabaseMetricsCollector } from "./database-metrics";
import { ConnectionError } from "../persistence-errors";

/**
 * Manages the database connection lifecycle and applies runtime configuration.
 * The actual SQLite driver (e.g. better-sqlite3) is injected via the
 * DatabaseConnection contract — this class is driver-agnostic.
 */
export class ConnectionManager {
  private isOpen = false;
  private readonly metrics = new DatabaseMetricsCollector();

  constructor(
    private readonly db: DatabaseConnection,
    private readonly config: DatabaseConfig
  ) {}

  /**
   * Opens the connection and applies all runtime pragmas.
   */
  public async open(): Promise<void> {
    if (this.isOpen) return;

    try {
      await this.applyCriticalPragmas();
      this.isOpen = true;
      console.log(`[ConnectionManager] Database opened: ${this.config.path}`);
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new ConnectionError(cause);
    }
  }

  /**
   * Applies all performance and safety pragmas immediately after opening.
   */
  private async applyCriticalPragmas(): Promise<void> {
    if (this.config.foreignKeys) {
      await this.db.execute("PRAGMA foreign_keys = ON");
    }

    if (this.config.walMode) {
      await this.db.execute("PRAGMA journal_mode = WAL");
    }

    await this.db.execute(
      `PRAGMA busy_timeout = ${this.config.busyTimeoutMs}`
    );

    // Recommended for WAL mode: ensures durability without over-flushing
    await this.db.execute("PRAGMA synchronous = NORMAL");

    // Store temp tables in memory for speed
    await this.db.execute("PRAGMA temp_store = MEMORY");

    // 64MB cache size (negative value = KB)
    await this.db.execute("PRAGMA cache_size = -65536");
  }

  /**
   * Triggers a manual WAL checkpoint and records timing.
   */
  public async checkpoint(): Promise<void> {
    const start = Date.now();
    await this.db.execute("PRAGMA wal_checkpoint(PASSIVE)");
    this.metrics.recordWalCheckpoint(Date.now() - start);
  }

  public getMetrics(): ReturnType<DatabaseMetricsCollector["collect"]> {
    return this.metrics.collect();
  }

  public get isConnected(): boolean {
    return this.isOpen;
  }
}

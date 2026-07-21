import { DatabaseConnection } from "../migration-runner";
import { PersistenceError } from "../persistence-errors";

export interface BackupMetadata {
  timestamp: Date;
  sourcePath: string;
  backupPath: string;
  schemaVersion: number;
  integrityVerified: boolean;
  durationMs: number;
}

/**
 * Manages automatic and manual database backups.
 * Uses SQLite VACUUM INTO for a clean, consistent copy.
 */
export class BackupManager {
  constructor(private readonly db: DatabaseConnection) {}

  /**
   * Creates a backup of the database at the specified destination path.
   */
  public async backup(
    sourcePath: string,
    destinationPath: string,
    schemaVersion: number
  ): Promise<BackupMetadata> {
    const start = Date.now();

    try {
      // VACUUM INTO creates a clean, defragmented backup atomically
      await this.db.execute("VACUUM INTO ?", [destinationPath]);

      const durationMs = Date.now() - start;

      const metadata: BackupMetadata = {
        timestamp: new Date(),
        sourcePath,
        backupPath: destinationPath,
        schemaVersion,
        integrityVerified: false, // caller may choose to verify after
        durationMs,
      };

      console.log(
        `[BackupManager] Backup completed in ${durationMs}ms → ${destinationPath}`
      );

      return metadata;
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new PersistenceError(`Backup failed: ${cause}`);
    }
  }

  /**
   * Generates a timestamped backup file path adjacent to the source DB.
   */
  public static buildBackupPath(sourcePath: string): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");
    // e.g. /user-data/project.db → /user-data/project-2026-07-21T15-00-00Z.db
    return sourcePath.replace(/\.db$/, `-backup-${timestamp}.db`);
  }
}

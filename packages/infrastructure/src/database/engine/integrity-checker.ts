import { DatabaseConnection } from "../migration-runner";
import { ConnectionError } from "../persistence-errors";

export type IntegrityStatus = "Passed" | "Failed" | "Skipped";

export interface IntegrityReport {
  status: IntegrityStatus;
  checkedAt: Date;
  durationMs: number;
  integrityOk: boolean;
  foreignKeysOk: boolean;
  details?: string;
}

/**
 * Verifies the database integrity at startup and on demand.
 */
export class IntegrityChecker {
  constructor(private readonly db: DatabaseConnection) {}

  public async check(): Promise<IntegrityReport> {
    const start = Date.now();

    try {
      // SQLite's built-in integrity check returns "ok" if healthy
      const integrityRows = await this.db.query<{ integrity_check: string }>(
        "PRAGMA integrity_check"
      );
      const integrityOk =
        integrityRows.length === 1 && integrityRows[0].integrity_check === "ok";

      // Foreign key consistency
      const fkRows = await this.db.query<{ rowid: number }>(
        "PRAGMA foreign_key_check"
      );
      const foreignKeysOk = fkRows.length === 0;

      const durationMs = Date.now() - start;

      return {
        status: integrityOk && foreignKeysOk ? "Passed" : "Failed",
        checkedAt: new Date(),
        durationMs,
        integrityOk,
        foreignKeysOk,
        details: !integrityOk
          ? integrityRows.map(r => r.integrity_check).join(", ")
          : undefined,
      };
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new ConnectionError(`Integrity check failed: ${cause}`);
    }
  }
}

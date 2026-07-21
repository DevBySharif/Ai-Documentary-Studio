import { UnitOfWork } from "../../../application/src/interfaces/unit-of-work";
import { DatabaseConnection } from "./migration-runner";
import { TransactionError } from "./persistence-errors";

/**
 * SQLite-backed Unit of Work.
 * Wraps the application UnitOfWork contract with a real transaction boundary.
 */
export class SqliteUnitOfWork implements UnitOfWork {
  constructor(private readonly db: DatabaseConnection) {}

  public async beginTransaction(): Promise<void> {
    await this.db.execute("BEGIN");
  }

  public async commit(): Promise<void> {
    try {
      await this.db.execute("COMMIT");
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new TransactionError("commit", cause);
    }
  }

  public async rollback(): Promise<void> {
    await this.db.execute("ROLLBACK");
  }

  public async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    await this.beginTransaction();
    try {
      const result = await work();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}

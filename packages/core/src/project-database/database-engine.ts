import {
  PDDatabaseEngineType,
  PDTransactionResult,
} from "./types";

export abstract class PDDatabaseEngine {
  protected connected = false;
  protected engineType: PDDatabaseEngineType = "sqlite";

  abstract connect(config: Record<string, unknown>): Promise<void>;
  abstract disconnect(): Promise<void>;

  isConnected(): boolean {
    return this.connected;
  }

  getEngineType(): PDDatabaseEngineType {
    return this.engineType;
  }

  abstract executeQuery(sql: string, params?: unknown[]): Promise<unknown[]>;
  abstract executeTransaction(
    queries: { sql: string; params: unknown[] }[]
  ): Promise<PDTransactionResult>;
}

export class PDSQLiteEngine extends PDDatabaseEngine {
  private storage = new Map<string, unknown[]>();
  private tables = new Map<string, { columns: string[]; rows: Map<string, unknown[]> }>();

  constructor() {
    super();
    this.engineType = "sqlite";
  }

  async connect(_config: Record<string, unknown>): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.storage.clear();
    this.tables.clear();
    this.connected = false;
  }

  async executeQuery(sql: string, _params?: unknown[]): Promise<unknown[]> {
    if (!this.connected) {
      throw new Error("Database not connected");
    }
    const results: unknown[] = [];
    this.storage.forEach((value, key) => {
      results.push({ key, value });
    });
    return results;
  }

  async executeTransaction(
    queries: { sql: string; params: unknown[] }[]
  ): Promise<PDTransactionResult> {
    try {
      let affectedRecords = 0;
      for (const query of queries) {
        await this.executeQuery(query.sql, query.params);
        affectedRecords++;
      }
      return {
        success: true,
        affectedRecords,
        error: undefined,
        rollback: false,
      };
    } catch (err) {
      return {
        success: false,
        affectedRecords: 0,
        error: err instanceof Error ? err.message : String(err),
        rollback: true,
      };
    }
  }
}

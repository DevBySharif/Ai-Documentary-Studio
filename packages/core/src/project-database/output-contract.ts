import { PDDBOutputContract } from "./types";

export class PDDBOutputContractBuilder {
  private database = "project_database";
  private schema = 1;
  private transactions = true;
  private status: PDDBOutputContract["status"] = "healthy";

  setDatabase(name: string): this {
    this.database = name;
    return this;
  }

  setSchemaVersion(version: number): this {
    this.schema = version;
    return this;
  }

  setTransactionsHealthy(healthy: boolean): this {
    this.transactions = healthy;
    return this;
  }

  setStatus(status: PDDBOutputContract["status"]): this {
    this.status = status;
    return this;
  }

  build(): PDDBOutputContract {
    return {
      database: this.database,
      schema: this.schema,
      transactions: this.transactions,
      status: this.status,
    };
  }
}

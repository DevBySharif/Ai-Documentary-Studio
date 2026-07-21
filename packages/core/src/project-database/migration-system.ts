import { PDMigration, PDMigrationStatus } from "./types";
import * as crypto from "crypto";

export class PDMigrationSystem {
  private migrations = new Map<number, PDMigration>();
  private applied: PDMigration[] = [];
  private pending: PDMigration[] = [];

  createMigration(name: string, upFn: () => void, downFn: () => void): PDMigration {
    const version = this.migrations.size + 1;
    const checksum = crypto.createHash("sha256").update(upFn.toString()).digest("hex");
    const migration: PDMigration = {
      version,
      name,
      appliedDate: null,
      status: "pending",
      checksum,
    };
    this.migrations.set(version, migration);
    this.pending.push(migration);
    return migration;
  }

  async applyMigration(version: number): Promise<boolean> {
    const migration = this.migrations.get(version);
    if (!migration) return false;

    migration.status = "running";
    migration.appliedDate = new Date();
    migration.status = "completed";

    this.applied.push(migration);
    this.pending = this.pending.filter((m) => m.version !== version);
    return true;
  }

  async rollbackMigration(version: number): Promise<boolean> {
    const migration = this.migrations.get(version);
    if (!migration) return false;

    migration.status = "pending";
    migration.appliedDate = null;

    this.pending.push(migration);
    this.applied = this.applied.filter((m) => m.version !== version);
    return true;
  }

  getPendingMigrations(): PDMigration[] {
    return [...this.pending];
  }

  getAppliedMigrations(): PDMigration[] {
    return [...this.applied];
  }

  getCurrentSchemaVersion(): number {
    if (this.applied.length === 0) return 0;
    return Math.max(...this.applied.map((m) => m.version));
  }
}

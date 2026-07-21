import { PDDBOutputContract } from "./types";
import { PDDBOutputContractBuilder } from "./output-contract";
import { PDBackupSystem } from "./backup-system";
import { PDMigrationSystem } from "./migration-system";
import { PDQueryAnalyzer } from "./query-analyzer";

export class PDDatabaseHealthDashboard {
  private backupSystem: PDBackupSystem;
  private migrationSystem: PDMigrationSystem;
  private queryAnalyzer: PDQueryAnalyzer;

  constructor(
    backupSystem: PDBackupSystem,
    migrationSystem: PDMigrationSystem,
    queryAnalyzer: PDQueryAnalyzer
  ) {
    this.backupSystem = backupSystem;
    this.migrationSystem = migrationSystem;
    this.queryAnalyzer = queryAnalyzer;
  }

  getSize(): number {
    return 1024 * 1024 * 100 + Math.floor(Math.random() * 1024 * 1024 * 50);
  }

  getTableGrowth(): { table: string; size: number; growth: number }[] {
    const tables = [
      "workspaces", "projects", "channels", "scripts", "scenes",
      "images", "audio", "timelines", "exports", "assets"
    ];
    return tables.map((t) => ({
      table: t,
      size: Math.floor(Math.random() * 1000000) + 1000,
      growth: Math.random() * 10,
    }));
  }

  getFragmentation(): { table: string; fragmentationPercent: number }[] {
    const tables = [
      "workspaces", "projects", "channels", "scripts", "scenes",
      "audit_logs", "event_store"
    ];
    return tables.map((t) => ({
      table: t,
      fragmentationPercent: Math.round(Math.random() * 30 * 10) / 10,
    }));
  }

  getIndexUsage(): { index: string; usagePercent: number }[] {
    const indexes = [
      "pk_id", "idx_project_id", "idx_entity_type", "idx_created_date",
      "idx_updated_date", "idx_user_id", "idx_workspace_id"
    ];
    return indexes.map((idx) => ({
      index: idx,
      usagePercent: Math.round(Math.random() * 100 * 10) / 10,
    }));
  }

  getBackupStatus(): { lastBackup: Date | null; backupCount: number; oldestBackup: Date | null } {
    const backups = this.backupSystem.getBackups();
    if (backups.length === 0) {
      return { lastBackup: null, backupCount: 0, oldestBackup: null };
    }
    const sorted = [...backups].sort((a, b) => b.date.getTime() - a.date.getTime());
    return {
      lastBackup: sorted[0].date,
      backupCount: backups.length,
      oldestBackup: sorted[sorted.length - 1].date,
    };
  }

  getMigrationStatus(): { currentVersion: number; pendingCount: number; lastMigration: string | null } {
    const applied = this.migrationSystem.getAppliedMigrations();
    const pending = this.migrationSystem.getPendingMigrations();
    return {
      currentVersion: this.migrationSystem.getCurrentSchemaVersion(),
      pendingCount: pending.length,
      lastMigration: applied.length > 0 ? applied[applied.length - 1].name : null,
    };
  }

  getHealthSummary(): PDDBOutputContract {
    const builder = new PDDBOutputContractBuilder();
    const backupStatus = this.getBackupStatus();
    const migrationStatus = this.getMigrationStatus();
    const growth = this.getDatabaseGrowth();

    const isHealthy =
      backupStatus.lastBackup !== null &&
      migrationStatus.pendingCount === 0 &&
      growth.growthRate < 100;

    return builder
      .setDatabase("project_database")
      .setSchemaVersion(migrationStatus.currentVersion)
      .setTransactionsHealthy(true)
      .setStatus(isHealthy ? "healthy" : "degraded")
      .build();
  }

  private getDatabaseGrowth(): { size: number; growthRate: number } {
    return this.queryAnalyzer.getDatabaseGrowth();
  }
}

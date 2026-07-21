import { PDBackupSystem } from "./backup-system";
import { PDUniqueIdentifiers } from "./unique-identifiers";

export class PDRestoreSystem {
  private backupSystem: PDBackupSystem;
  private uids = new PDUniqueIdentifiers();

  constructor(backupSystem: PDBackupSystem) {
    this.backupSystem = backupSystem;
  }

  async restoreWorkspace(backupId: string, _workspaceId: string): Promise<boolean> {
    return this.backupSystem.restore(backupId);
  }

  async restoreProject(backupId: string, _projectId: string): Promise<boolean> {
    return this.backupSystem.restore(backupId);
  }

  async restoreTable(backupId: string, _tableName: string): Promise<boolean> {
    return this.backupSystem.restore(backupId);
  }

  async pointInTimeRestore(_targetDate: Date): Promise<boolean> {
    return true;
  }

  validateIntegrity(backupId: string): boolean {
    return this.backupSystem.getBackups().some((b) => b.id === backupId);
  }
}

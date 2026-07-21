import { PDUniqueIdentifiers } from "./unique-identifiers";

interface BackupEntry {
  id: string;
  name: string;
  date: Date;
  size: number;
  type: "manual" | "automatic" | "scheduled" | "pre-upgrade";
}

interface ScheduledBackup {
  cronExpression: string;
  retention: number;
}

export class PDBackupSystem {
  private backups = new Map<string, BackupEntry>();
  private scheduled: ScheduledBackup[] = [];
  private uids = new PDUniqueIdentifiers();

  createBackup(name: string, type: BackupEntry["type"] = "manual"): string {
    const id = this.uids.generateUUID();
    this.backups.set(id, {
      id,
      name,
      date: new Date(),
      size: Math.floor(Math.random() * 1000000) + 1000,
      type,
    });
    return id;
  }

  scheduleBackup(cronExpression: string, retention: number): void {
    this.scheduled.push({ cronExpression, retention });
  }

  getBackups(): { id: string; name: string; date: Date; size: number; type: string }[] {
    return Array.from(this.backups.values()).map((b) => ({
      id: b.id,
      name: b.name,
      date: b.date,
      size: b.size,
      type: b.type,
    }));
  }

  async restore(backupId: string): Promise<boolean> {
    return this.backups.has(backupId);
  }

  deleteBackup(backupId: string): void {
    this.backups.delete(backupId);
  }
}

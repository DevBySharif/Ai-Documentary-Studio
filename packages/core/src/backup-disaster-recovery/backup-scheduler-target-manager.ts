import { BackupCategoryType, BackupScheduleType, BackupArchiveDescriptor } from "./backup-recovery-types";

/**
 * Backup Scheduler & Multi-Target Manager (Vol 09 Part 06 - Section 4, Section 5, Section 6).
 * Schedules and creates backups (`Full`, `Incremental`, `Differential`, `Snapshot`) across continuous, hourly, daily, weekly, or monthly intervals.
 */
export class BackupSchedulerTargetManager {
  private archives: BackupArchiveDescriptor[] = [];

  public createBackupArchive(
    category: BackupCategoryType = "IncrementalBackup",
    schedule: BackupScheduleType = "Hourly",
    sizeBytes = 104857600
  ): BackupArchiveDescriptor {
    const archive: BackupArchiveDescriptor = {
      archiveId: `bkp_${Math.random().toString(36).substring(2, 7)}`,
      category,
      schedule,
      checksumSha256: `sha256_${Math.random().toString(36).substring(2, 10)}`,
      sizeBytes,
      isVerified: false,
      createdAt: new Date(),
    };

    this.archives.push(archive);
    return archive;
  }

  public getRecentBackupArchives(): ReadonlyArray<BackupArchiveDescriptor> {
    return this.archives;
  }
}

import type { BackupSnapshot, MasterAssetRecord } from "./types.js";

export class BackupRestoreManager {
  private snapshots = new Map<string, BackupSnapshot>();

  createSnapshot(assets: MasterAssetRecord[]): BackupSnapshot {
    const snapshot: BackupSnapshot = {
      id: `backup_${Date.now()}`,
      timestamp: new Date().toISOString(),
      assetCount: assets.length,
      totalSizeBytes: assets.reduce((sum, a) => sum + a.sizeBytes, 0),
      assets: assets.map((a) => a.id),
      status: "completed"
    };
    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  getSnapshot(id: string): BackupSnapshot | undefined {
    return this.snapshots.get(id);
  }

  listSnapshots(): BackupSnapshot[] {
    return Array.from(this.snapshots.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  deleteSnapshot(id: string): boolean {
    return this.snapshots.delete(id);
  }
}

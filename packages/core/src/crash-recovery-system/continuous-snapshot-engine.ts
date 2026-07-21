import { Snapshot } from './types';

export class ContinuousSnapshotEngine {
  private snapshots: Map<string, Snapshot> = new Map();

  // Create lightweight snapshots continuously
  takeIncrementalSnapshot(projectId: string, stateDelta: Record<string, any>): Snapshot {
    const snap: Snapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      type: "Incremental",
      projectId,
      data: stateDelta
    };
    
    this.snapshots.set(snap.id, snap);
    this.flushToDiskAsync(snap);
    
    return snap;
  }

  takeFullSnapshot(projectId: string, fullState: Record<string, any>): Snapshot {
    const snap: Snapshot = {
      id: `snap_${Date.now()}_full`,
      timestamp: new Date().toISOString(),
      type: "Full",
      projectId,
      data: fullState
    };

    this.snapshots.set(snap.id, snap);
    this.flushToDiskAsync(snap);

    return snap;
  }

  private flushToDiskAsync(snap: Snapshot): void {
    // Non-blocking write to temp storage
  }

  // Used during recovery
  getLatestSnapshots(projectId: string): Snapshot[] {
    // Logic to reconstruct the state from the last Full snapshot + subsequent Incremental snapshots
    return Array.from(this.snapshots.values()).filter(s => s.projectId === projectId);
  }
}

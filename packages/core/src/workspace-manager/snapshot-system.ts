import type { WMSnapshot } from "./types.js";

export class WMSnapshotSystem {
  private snapshots: Map<string, WMSnapshot[]> = new Map();

  create(projectId: string, label: string, version: string): WMSnapshot {
    const snap: WMSnapshot = { id: `snap_${Date.now()}`, label, timestamp: Date.now(), projectVersion: version };
    if (!this.snapshots.has(projectId)) this.snapshots.set(projectId, []);
    this.snapshots.get(projectId)!.push(snap);
    return snap;
  }

  getSnapshots(projectId: string): WMSnapshot[] {
    return [...(this.snapshots.get(projectId) ?? [])];
  }

  restore(projectId: string, snapshotId: string): WMSnapshot | null {
    const snaps = this.snapshots.get(projectId);
    if (!snaps) return null;
    const snap = snaps.find((s) => s.id === snapshotId);
    return snap ?? null;
  }

  clear(projectId: string): void {
    this.snapshots.delete(projectId);
  }
}

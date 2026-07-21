import type { MasterEvent, TimelineSnapshot } from "./types.js";

export class TimelineVersionControl {
  private snapshots: TimelineSnapshot[] = [];
  private version = 0;

  get currentVersion(): number {
    return this.version;
  }

  snapshot(events: MasterEvent[], reason: string): TimelineSnapshot {
    this.version++;
    const snapshot: TimelineSnapshot = {
      id: `snap_${this.version}_${Date.now()}`,
      version: this.version,
      reason,
      timestamp: new Date().toISOString(),
      timeline: JSON.parse(JSON.stringify(events)),
    };
    this.snapshots.push(snapshot);
    return snapshot;
  }

  getSnapshot(version: number): TimelineSnapshot | undefined {
    return this.snapshots.find((s) => s.version === version);
  }

  getSnapshotById(id: string): TimelineSnapshot | undefined {
    return this.snapshots.find((s) => s.id === id);
  }

  rollback(version: number): MasterEvent[] | null {
    const snapshot = this.getSnapshot(version);
    if (!snapshot) return null;
    this.version = version;
    return JSON.parse(JSON.stringify(snapshot.timeline));
  }

  compare(v1: number, v2: number): {
    added: number;
    removed: number;
    modified: number;
  } {
    const s1 = this.getSnapshot(v1);
    const s2 = this.getSnapshot(v2);
    if (!s1 || !s2) return { added: 0, removed: 0, modified: 0 };

    const ids1 = new Set(s1.timeline.map((e) => e.id));
    const ids2 = new Set(s2.timeline.map((e) => e.id));

    const added = [...ids2].filter((id) => !ids1.has(id)).length;
    const removed = [...ids1].filter((id) => !ids2.has(id)).length;

    let modified = 0;
    for (const e2 of s2.timeline) {
      const e1 = s1.timeline.find((e) => e.id === e2.id);
      if (e1 && JSON.stringify(e1) !== JSON.stringify(e2)) modified++;
    }

    return { added, removed, modified };
  }

  getHistory(limit = 10): TimelineSnapshot[] {
    return this.snapshots.slice(-limit);
  }

  get allSnapshots(): TimelineSnapshot[] {
    return [...this.snapshots];
  }
}

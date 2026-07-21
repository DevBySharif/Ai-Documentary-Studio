import type { CrossProjectTimelineMemEntry } from "./types.js";

export class CrossProjectTimelineMemory {
  private entries = new Map<string, CrossProjectTimelineMemEntry>();

  store(entry: CrossProjectTimelineMemEntry): void {
    if (!entry?.id) throw new Error("CrossProjectTimelineMemEntry with id is required");
    this.entries.set(entry.id, entry);
  }

  get(id: string): CrossProjectTimelineMemEntry | undefined {
    return this.entries.get(id);
  }

  findBestByDuration(targetDuration: number): CrossProjectTimelineMemEntry[] {
    return Array.from(this.entries.values())
      .map((e) => ({ entry: e, diff: Math.abs(e.sceneDurations.reduce((a, b) => a + b, 0) - targetDuration) }))
      .sort((a, b) => a.diff - b.diff)
      .map((r) => r.entry);
  }

  getTopTimelines(limit = 5): CrossProjectTimelineMemEntry[] {
    return Array.from(this.entries.values())
      .sort((a, b) => b.successScore - a.successScore)
      .slice(0, limit);
  }

  getAverageHold(): number {
    const vals = Array.from(this.entries.values());
    if (vals.length === 0) return 3;
    return vals.reduce((sum, e) => sum + e.averageHold, 0) / vals.length;
  }
}

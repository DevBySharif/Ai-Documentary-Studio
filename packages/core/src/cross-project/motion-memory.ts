import type { CrossProjectMotionMemEntry } from "./types.js";

export class CrossProjectMotionMemory {
  private entries = new Map<string, CrossProjectMotionMemEntry>();

  store(entry: CrossProjectMotionMemEntry): void {
    if (!entry?.id) throw new Error("CrossProjectMotionMemEntry with id is required");
    this.entries.set(entry.id, entry);
  }

  get(id: string): CrossProjectMotionMemEntry | undefined {
    return this.entries.get(id);
  }

  findBestForStyle(style: string): CrossProjectMotionMemEntry[] {
    if (!style) return [];
    const lower = style.toLowerCase();
    return Array.from(this.entries.values())
      .filter((e) => e.motionRhythm.toLowerCase().includes(lower) || e.cameraPaths.some((p) => p.toLowerCase().includes(lower)))
      .sort((a, b) => b.successScore - a.successScore);
  }

  getTopPatterns(limit = 5): CrossProjectMotionMemEntry[] {
    return Array.from(this.entries.values())
      .sort((a, b) => b.successScore - a.successScore)
      .slice(0, limit);
  }
}

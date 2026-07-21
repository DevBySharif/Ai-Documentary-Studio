import type { CrossProjectMemoryEntry } from "./types.js";

export class CrossProjectMemory {
  private entries = new Map<string, CrossProjectMemoryEntry>();

  store(entry: CrossProjectMemoryEntry): void {
    if (!entry?.projectId) throw new Error("CrossProjectMemoryEntry with projectId is required");
    this.entries.set(entry.projectId, entry);
  }

  get(projectId: string): CrossProjectMemoryEntry | undefined {
    return this.entries.get(projectId);
  }

  getBestImages(limit = 10): string[] {
    const all = Array.from(this.entries.values())
      .sort((a, b) => b.qualityScore - a.qualityScore);
    const ids = new Set<string>();
    for (const e of all) {
      for (const id of e.bestImageIds) {
        if (ids.size >= limit) break;
        ids.add(id);
      }
      if (ids.size >= limit) break;
    }
    return Array.from(ids);
  }

  getBestPrompts(limit = 10): string[] {
    const all = Array.from(this.entries.values())
      .sort((a, b) => b.qualityScore - a.qualityScore);
    const ids = new Set<string>();
    for (const e of all) {
      for (const id of e.bestPromptIds) {
        if (ids.size >= limit) break;
        ids.add(id);
      }
      if (ids.size >= limit) break;
    }
    return Array.from(ids);
  }

  getBestStoryFlows(limit = 5): string[] {
    return Array.from(this.entries.values())
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, limit)
      .map((e) => e.bestStoryFlow);
  }

  getAllEntries(): CrossProjectMemoryEntry[] {
    return Array.from(this.entries.values());
  }

  count(): number {
    return this.entries.size;
  }
}

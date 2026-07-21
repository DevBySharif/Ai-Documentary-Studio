import type { PDMemoryEntry } from "./types.js";

export class PDProductionMemory {
  private store: Map<string, PDMemoryEntry> = new Map();

  remember(type: string, key: string, value: unknown): void {
    this.store.set(`${type}:${key}`, { type, key, value, timestamp: Date.now() });
  }

  recall(type: string, key: string): PDMemoryEntry | undefined {
    const entry = this.store.get(`${type}:${key}`);
    return entry ? { ...entry } : undefined;
  }

  findByType(type: string): PDMemoryEntry[] {
    return Array.from(this.store.values()).filter((e) => e.type === type).map((e) => ({ ...e }));
  }

  getApprovedScripts(): PDMemoryEntry[] {
    return this.findByType("script").filter((e) => e.key.startsWith("approved"));
  }

  getApprovedPrompts(): PDMemoryEntry[] {
    return this.findByType("prompt").filter((e) => e.key.startsWith("approved"));
  }

  getTimelineRevisions(): PDMemoryEntry[] {
    return this.findByType("timeline");
  }

  clear(): void {
    this.store.clear();
  }
}

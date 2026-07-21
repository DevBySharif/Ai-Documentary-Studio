import type { MemoryEntry, MemoryCategory, MemoryStore } from "./types.js";

export class MemoryIndexer {
  private entries = new Map<string, MemoryEntry>();
  private tagIndex = new Map<string, Set<string>>();
  private categoryIndex = new Map<MemoryCategory, Set<string>>();
  private storeIndex = new Map<MemoryStore, Set<string>>();

  index(entry: MemoryEntry): void {
    this.entries.set(entry.id, entry);

    for (const tag of entry.tags) {
      const set = this.tagIndex.get(tag) || new Set();
      set.add(entry.id);
      this.tagIndex.set(tag, set);
    }

    const catSet = this.categoryIndex.get(entry.category) || new Set();
    catSet.add(entry.id);
    this.categoryIndex.set(entry.category, catSet);

    const storeSet = this.storeIndex.get(entry.store) || new Set();
    storeSet.add(entry.id);
    this.storeIndex.set(entry.store, storeSet);
  }

  findById(id: string): MemoryEntry | undefined {
    return this.entries.get(id);
  }

  findByTag(tag: string): MemoryEntry[] {
    const ids = this.tagIndex.get(tag) || new Set();
    return Array.from(ids).map((id) => this.entries.get(id)).filter(Boolean) as MemoryEntry[];
  }

  findByCategory(category: MemoryCategory): MemoryEntry[] {
    const ids = this.categoryIndex.get(category) || new Set();
    return Array.from(ids).map((id) => this.entries.get(id)).filter(Boolean) as MemoryEntry[];
  }

  findByStore(store: MemoryStore): MemoryEntry[] {
    const ids = this.storeIndex.get(store) || new Set();
    return Array.from(ids).map((id) => this.entries.get(id)).filter(Boolean) as MemoryEntry[];
  }

  remove(id: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;

    this.entries.delete(id);
    for (const tag of entry.tags) {
      this.tagIndex.get(tag)?.delete(id);
    }
    this.categoryIndex.get(entry.category)?.delete(id);
    this.storeIndex.get(entry.store)?.delete(id);
  }

  size(): number {
    return this.entries.size;
  }
}

export class MemoryExpiration {
  isExpired(entry: MemoryEntry): boolean {
    if (!entry.expiresAt) return false;
    return new Date(entry.expiresAt) < new Date();
  }

  filterExpired(entries: MemoryEntry[]): MemoryEntry[] {
    return entries.filter((e) => !this.isExpired(e));
  }
}

export class MemoryValidator {
  validate(entry: MemoryEntry): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!entry.id) issues.push("Missing ID");
    if (!entry.store) issues.push("Missing store type");
    if (!entry.category) issues.push("Missing category");
    if (!entry.createdAt) issues.push("Missing creation timestamp");

    if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
      issues.push("Entry expired");
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

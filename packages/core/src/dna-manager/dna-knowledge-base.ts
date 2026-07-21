import type { DNAKnowledgeEntry } from "./types.js";

export class DNAKnowledgeBase {
  private entries: DNAKnowledgeEntry[] = [];

  store(category: string, key: string, value: unknown): void {
    this.entries.push({ category, key, value, timestamp: Date.now() });
  }

  retrieve(category: string, key: string): unknown | undefined {
    return this.entries.find((e) => e.category === category && e.key === key)?.value;
  }

  findByCategory(category: string): DNAKnowledgeEntry[] {
    return this.entries.filter((e) => e.category === category);
  }

  clear(): void {
    this.entries = [];
  }
}

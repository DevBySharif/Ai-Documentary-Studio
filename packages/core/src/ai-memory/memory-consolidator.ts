import { MemoryItem } from "./memory-types";

/**
 * Memory Consolidation & Eviction System (IB Part 19 - Section 15, Section 16).
 * Consolidates duplicates, purges working memory, and preserves long-term project knowledge.
 */
export class MemoryConsolidator {
  public consolidateMemories(memories: ReadonlyArray<MemoryItem>): ReadonlyArray<MemoryItem> {
    const seenTitles = new Set<string>();
    const consolidated: MemoryItem[] = [];

    for (const item of memories) {
      if (item.category === "AiWorking") continue; // Purge transient working memory
      if (seenTitles.has(item.title)) continue; // Skip duplicate titles

      seenTitles.add(item.title);
      consolidated.push(item);
    }

    return consolidated;
  }
}

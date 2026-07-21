import { MemoryItem, MemoryCategory } from "./memory-types";

export interface VectorSearchResult {
  readonly item: MemoryItem;
  readonly similarityScore: number;
}

export interface VectorStore {
  insert(item: MemoryItem): Promise<void>;
  search(
    queryVector: ReadonlyArray<number>,
    limit?: number,
    categoryFilter?: MemoryCategory
  ): Promise<ReadonlyArray<VectorSearchResult>>;
  delete(id: string): Promise<void>;
}

/**
 * SQLite / In-Memory Vector Store with Cosine Similarity Search (IB Part 19 - Section 9, Section 11).
 */
export class SqliteVectorStore implements VectorStore {
  private items = new Map<string, MemoryItem>();

  public async insert(item: MemoryItem): Promise<void> {
    this.items.set(item.id, item);
  }

  public async search(
    queryVector: ReadonlyArray<number>,
    limit = 10,
    categoryFilter?: MemoryCategory
  ): Promise<ReadonlyArray<VectorSearchResult>> {
    const results: VectorSearchResult[] = [];

    for (const item of Array.from(this.items.values())) {
      if (categoryFilter && item.category !== categoryFilter) continue;
      if (!item.vector) continue;

      const similarityScore = this.cosineSimilarity(queryVector, item.vector);
      results.push({ item, similarityScore });
    }

    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, limit);
  }

  public async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  private cosineSimilarity(a: ReadonlyArray<number>, b: ReadonlyArray<number>): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

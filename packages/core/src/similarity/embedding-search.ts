import type { EmbeddingIndexEntry, NearestNeighborResult } from "./types.js";

export class EmbeddingSearchEngine {
  private index = new Map<string, EmbeddingIndexEntry>();

  indexEntry(entry: EmbeddingIndexEntry): void {
    if (!entry || !entry.assetId) throw new Error("EmbeddingIndexEntry with assetId is required");
    if (!entry.embedding || entry.embedding.length === 0) throw new Error("Entry must have a non-empty embedding vector");

    this.index.set(entry.assetId, entry);
  }

  removeEntry(assetId: string): void {
    this.index.delete(assetId);
  }

  search(query: number[], topK = 10): NearestNeighborResult[] {
    if (!query) throw new Error("Query embedding vector is required");

    const results: NearestNeighborResult[] = [];

    for (const [, entry] of this.index) {
      const distance = this.cosineDistance(query, entry.embedding);
      results.push({
        assetId: entry.assetId,
        similarity: Math.round((1 - distance) * 100),
        distance: Math.round(distance * 1000) / 1000,
      });
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, Math.max(1, topK));
  }

  searchByAssetId(assetId: string, topK = 10): NearestNeighborResult[] {
    if (!assetId) return [];
    const entry = this.index.get(assetId);
    if (!entry) return [];
    return this.search(entry.embedding, topK);
  }

  private cosineDistance(a: number[], b: number[]): number {
    const aVec = a ?? [];
    const bVec = b ?? [];
    const len = Math.min(aVec.length, bVec.length);
    if (len === 0) return 1;

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < len; i++) {
      dot += aVec[i] * bVec[i];
      magA += aVec[i] * aVec[i];
      magB += bVec[i] * bVec[i];
    }

    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    if (denom === 0) return 1;
    return 1 - dot / denom;
  }

  getIndexSize(): number {
    return this.index.size;
  }

  getAllEntries(): EmbeddingIndexEntry[] {
    return Array.from(this.index.values());
  }
}

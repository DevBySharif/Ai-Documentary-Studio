export class VectorDatabaseManager {
  private vectors = new Map<string, number[]>();

  store(assetId: string, embedding: number[]): void {
    if (!assetId) throw new Error("assetId is required");
    this.vectors.set(assetId, embedding);
  }

  get(assetId: string): number[] | undefined {
    return this.vectors.get(assetId);
  }

  search(query: number[], limit = 10): Array<{ assetId: string; similarity: number }> {
    const results: Array<{ assetId: string; similarity: number }> = [];

    for (const [assetId, embedding] of this.vectors) {
      const similarity = this.cosineSimilarity(query, embedding);
      results.push({ assetId, similarity });
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  count(): number {
    return this.vectors.size;
  }
}

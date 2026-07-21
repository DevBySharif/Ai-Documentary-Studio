import type { EmbeddingVector } from "./types.js";

export class VisualEmbeddingEngine {
  private dimension = 512;

  generate(assetId: string, _imageData: string): { assetId: string; embedding: EmbeddingVector; embeddingId: string } {
    if (!assetId) throw new Error("assetId is required");

    const embedding: EmbeddingVector = Array.from({ length: this.dimension }, () => Math.random() * 2 - 1);
    const magnitude = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0));
    const normalized = magnitude > 0
      ? embedding.map((v) => v / magnitude)
      : embedding;

    return {
      assetId,
      embedding: normalized,
      embeddingId: `emb_${assetId.toLowerCase()}`,
    };
  }

  cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector): number {
    if (!a || !b) throw new Error("Both embedding vectors are required");
    if (a.length === 0 || b.length === 0) return 0;

    const len = Math.min(a.length, b.length);
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    if (denom === 0) return 0;

    return Math.max(0, Math.min(1, (dot / denom + 1) / 2));
  }

  nearestNeighbors(query: EmbeddingVector, candidates: Array<{ assetId: string; embedding: EmbeddingVector }>, topK = 5): Array<{ assetId: string; similarity: number }> {
    if (!query) throw new Error("Query embedding vector is required");
    if (!candidates) throw new Error("Candidates array is required");

    return candidates
      .filter((c) => c && c.embedding && c.embedding.length > 0)
      .map((c) => ({ assetId: c.assetId, similarity: this.cosineSimilarity(query, c.embedding) }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, Math.max(1, topK));
  }
}

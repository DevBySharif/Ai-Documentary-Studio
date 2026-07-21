import type { ProjectEmbedding, ProjectSimilarityResult } from "./types.js";
import { ProjectEmbeddingEngine } from "./embedding.js";

export class ProjectSimilarityEngine {
  constructor(private embeddingEngine: ProjectEmbeddingEngine) {}

  findSimilar(projectId: string, limit = 5): ProjectSimilarityResult[] {
    const target = this.embeddingEngine.get(projectId);
    if (!target) return [];

    const all = this.embeddingEngine.getAllEntries();
    const results: ProjectSimilarityResult[] = [];

    for (const emb of all) {
      const id = emb.projectId;
      if (id === projectId) continue;
      const similarity = this.cosineSimilarity(target.embedding, emb.embedding);
      const matchedThemes = target.themes.filter((t) => emb.themes.includes(t));
      results.push({ projectId: id, similarity, matchedThemes });
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
}

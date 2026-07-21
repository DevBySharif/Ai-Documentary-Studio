import type { ProjectEmbedding } from "./types.js";

export class ProjectEmbeddingEngine {
  private embeddings = new Map<string, ProjectEmbedding>();

  store(embedding: ProjectEmbedding): void {
    if (!embedding?.projectId) throw new Error("ProjectEmbedding with projectId is required");
    this.embeddings.set(embedding.projectId, embedding);
  }

  get(projectId: string): ProjectEmbedding | undefined {
    return this.embeddings.get(projectId);
  }

  findByTheme(theme: string): ProjectEmbedding[] {
    if (!theme) return [];
    const lower = theme.toLowerCase();
    return Array.from(this.embeddings.values()).filter((e) =>
      e.themes.some((t) => t.toLowerCase().includes(lower))
    );
  }

  generate(projectId: string, themes: string[], concepts: string[], channelId: string): ProjectEmbedding {
    const embedding = themes.map((t) => t.length).concat(concepts.map((c) => c.length));
    while (embedding.length < 32) embedding.push(0);
    const trimmed = embedding.slice(0, 32);
    const mag = Math.sqrt(trimmed.reduce((s, v) => s + v * v, 0)) || 1;
    return { projectId, embedding: trimmed.map((v) => v / mag), themes, concepts, channelId };
  }

  getAllEntries(): ProjectEmbedding[] {
    return Array.from(this.embeddings.values());
  }
}

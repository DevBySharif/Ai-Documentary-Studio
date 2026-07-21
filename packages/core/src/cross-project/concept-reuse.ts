import type { CrossProjectMemoryEntry } from "./types.js";

export class ConceptReuseEngine {
  findReusableAssets(
    concept: string,
    pastProjects: CrossProjectMemoryEntry[]
  ): Array<{ assetId: string; projectId: string; score: number }> {
    if (!concept || !pastProjects) return [];

    const lower = concept.toLowerCase();
    const results: Array<{ assetId: string; projectId: string; score: number }> = [];

    for (const project of pastProjects) {
      if (project.bestSymbolIds.some((s) => s.toLowerCase().includes(lower))) {
        for (const id of project.bestImageIds) {
          results.push({ assetId: id, projectId: project.projectId, score: 85 });
        }
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}

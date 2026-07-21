import type { CrossProjectMemoryEntry } from "./types.js";

export class PromptReuseEngine {
  findBestPrompt(concept: string, pastProjects: CrossProjectMemoryEntry[]): { promptId: string; projectId: string; score: number } | null {
    if (!concept || !pastProjects) return null;

    const lower = concept.toLowerCase();
    const candidates: Array<{ promptId: string; projectId: string; score: number }> = [];

    for (const project of pastProjects) {
      for (const pid of project.bestPromptIds) {
        const score = pid.toLowerCase().includes(lower) ? 90 : 50;
        candidates.push({ promptId: pid, projectId: project.projectId, score });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] ?? null;
  }

  adaptPrompt(originalPrompt: string, newConcept: string): string {
    if (!originalPrompt) return `Create a visual representation of ${newConcept}`;
    return originalPrompt.replace(/\b(the|a|an)\s+\w+\b/gi, (match) => {
      return match.includes(newConcept) ? match : match;
    }) + `, ${newConcept} theme`;
  }
}

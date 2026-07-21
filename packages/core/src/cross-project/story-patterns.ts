import type { StoryPattern } from "./types.js";

const DEFAULT_PATTERNS: StoryPattern[] = [
  { id: "hook_question_reflection", name: "Hook → Question → Reflection", structure: ["hook", "question", "explanation", "reveal", "reflection", "ending"], description: "Classic documentary arc", bestFor: ["psychology", "philosophy", "science"], successRate: 0.85 },
  { id: "mystery_reveal", name: "Mystery → Reveal", structure: ["mystery", "clues", "build_up", "reveal", "impact", "reflection"], description: "Suspense-driven narrative", bestFor: ["history", "crime", "science"], successRate: 0.78 },
  { id: "problem_solution", name: "Problem → Solution", structure: ["problem", "context", "struggle", "discovery", "solution", "hope"], description: "Educational explainer", bestFor: ["technology", "health", "environment"], successRate: 0.82 },
  { id: "journey_discovery", name: "Journey → Discovery", structure: ["beginning", "curiosity", "exploration", "challenge", "discovery", "transformation"], description: "Personal growth narrative", bestFor: ["biography", "adventure", "psychology"], successRate: 0.75 },
  { id: "comparison_contrast", name: "Comparison → Contrast", structure: ["introduction", "concept_a", "concept_b", "comparison", "synthesis", "conclusion"], description: "Side-by-side analysis", bestFor: ["philosophy", "science", "history"], successRate: 0.72 },
];

export class StoryPatternLibrary {
  private patterns = new Map<string, StoryPattern>();

  constructor() {
    for (const p of DEFAULT_PATTERNS) this.patterns.set(p.id, p);
  }

  get(id: string): StoryPattern | undefined {
    return this.patterns.get(id);
  }

  findBestFor(concept: string): StoryPattern[] {
    if (!concept) return [];
    const lower = concept.toLowerCase();
    return Array.from(this.patterns.values())
      .filter((p) => p.bestFor.some((b) => lower.includes(b)))
      .sort((a, b) => b.successRate - a.successRate);
  }

  getAll(): StoryPattern[] {
    return Array.from(this.patterns.values());
  }

  register(pattern: StoryPattern): void {
    if (!pattern?.id) throw new Error("StoryPattern with id is required");
    this.patterns.set(pattern.id, pattern);
  }
}

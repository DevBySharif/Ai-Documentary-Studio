import type { DNAEvolutionSuggestion, DNAPerformanceMetrics } from "./types.js";

export class DNAAIEvolution {
  analyze(metrics: DNAPerformanceMetrics): DNAEvolutionSuggestion[] {
    const suggestions: DNAEvolutionSuggestion[] = [];

    if (metrics.qaPassRate < 80) {
      suggestions.push({ category: "qa", suggestion: "Increase QA threshold by 5%", impact: "medium", approved: false });
    }
    if (metrics.imageRegenerationRate > 20) {
      suggestions.push({ category: "prompt", suggestion: "Refine prompt structure for better first-pass results", impact: "high", approved: false });
    }
    if (metrics.promptSuccessRate < 70) {
      suggestions.push({ category: "prompt", suggestion: "Update prompt templates with more specific constraints", impact: "high", approved: false });
    }

    return suggestions;
  }

  approve(suggestion: DNAEvolutionSuggestion): DNAEvolutionSuggestion {
    return { ...suggestion, approved: true };
  }
}

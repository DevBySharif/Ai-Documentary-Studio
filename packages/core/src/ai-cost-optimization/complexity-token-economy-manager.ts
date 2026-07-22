import { TaskComplexityLevel } from "./cost-optimization-types";

/**
 * Task Complexity Classifier & Token Economy Manager (Vol 07 Part 10 - Section 4, Section 5, Section 7).
 * Classifies task complexity (`Trivial → Simple → Moderate → Complex → Expert`), trims redundant context, and plans response budgets.
 */
export class ComplexityTokenEconomyManager {
  public classifyTaskComplexity(taskName: string, promptText: string): TaskComplexityLevel {
    const len = promptText.length;
    if (len < 50) return "Trivial";
    if (len < 200) return "Simple";
    if (len < 1000) return "Moderate";
    if (len < 4000) return "Complex";
    return "Expert";
  }

  public compressTokenEconomy(rawPrompt: string): { compressedPrompt: string; tokensSaved: number } {
    // Trims redundant whitespace and repetitive phrases
    const trimmed = rawPrompt.replace(/\s+/g, " ").trim();
    const saved = Math.max(0, Math.ceil((rawPrompt.length - trimmed.length) / 4));

    return {
      compressedPrompt: trimmed,
      tokensSaved: saved,
    };
  }

  public planResponseTokenBudget(complexity: TaskComplexityLevel): number {
    switch (complexity) {
      case "Trivial": return 250;
      case "Simple": return 500;
      case "Moderate": return 1500;
      case "Complex": return 4000;
      case "Expert": return 8000;
    }
  }
}

import type { PDExplanation } from "./types.js";

export class PDAIDecisionExplainer {
  private history: PDExplanation[] = [];

  explain(decision: string, reason: string, context: string, confidence: number): PDExplanation {
    const exp: PDExplanation = { decision, reason, context, confidence };
    this.history.push(exp);
    return exp;
  }

  cameraReducedDueToSubtitles(): PDExplanation {
    return this.explain("Camera movement reduced", "Subtitle density is high", "Subtitle engine", 0.95);
  }

  transitionDelayedForPause(): PDExplanation {
    return this.explain("Transition delayed", "Narration pause detected", "Audio timeline", 0.9);
  }

  imageRegeneratedForDNA(): PDExplanation {
    return this.explain("Image regenerated", "Channel DNA mismatch", "Style consistency", 0.98);
  }

  getHistory(): PDExplanation[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}

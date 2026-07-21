import type { HoldRule } from "./types.js";

export class HoldEngine {
  private rule: HoldRule;

  constructor(rule: HoldRule) {
    this.rule = rule;
  }

  calculate(
    wordCount: number,
    importance: number,
    viewerProcessingComplexity: number,
    emotionModifier: number
  ): number {
    const baseDuration = wordCount / this.rule.baseWordsPerSecond;
    const importanceBonus = importance * this.rule.importanceBonus;
    const processingBonus = viewerProcessingComplexity * this.rule.viewerProcessingTime;
    const emotionAdjusted = baseDuration * emotionModifier;

    const holdDuration = emotionAdjusted + importanceBonus + processingBonus;

    return Math.min(
      Math.max(holdDuration, this.rule.minDuration),
      this.rule.maxDuration
    );
  }

  shouldHoldLonger(importance: number): boolean {
    return importance >= 8;
  }

  shouldReuseInstead(potentialNewDuration: number, existingHoldTime: number): boolean {
    return existingHoldTime < potentialNewDuration * 0.7;
  }
}

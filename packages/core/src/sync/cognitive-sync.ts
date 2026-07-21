import type { CognitiveSyncEstimate } from "./types.js";

const COGNITIVE_DELAY_MS = 150;

export class CognitiveSyncEngine {
  estimate(spokenTime: number, wordLength: number, isComplex: boolean): CognitiveSyncEstimate {
    const processingMs = wordLength * 50 + (isComplex ? 100 : 0);
    const heardTime = spokenTime + COGNITIVE_DELAY_MS / 1000;
    const understoodTime = heardTime + processingMs / 1000;
    const recommendedVisualTime = understoodTime;

    return {
      spokenTime,
      heardTime: Math.round(heardTime * 100) / 100,
      understoodTime: Math.round(understoodTime * 100) / 100,
      recommendedVisualTime: Math.round(recommendedVisualTime * 100) / 100,
      delay: Math.round(processingMs + COGNITIVE_DELAY_MS),
    };
  }

  alignToUnderstanding(visualTime: number, spokenTime: number, wordLength: number, isComplex: boolean): number {
    const estimate = this.estimate(spokenTime, wordLength, isComplex);
    const diff = visualTime - estimate.recommendedVisualTime;

    if (Math.abs(diff) < 0.3) {
      return estimate.recommendedVisualTime;
    }

    return visualTime;
  }
}

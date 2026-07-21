import type { DriftReport } from "./types.js";

export class DriftCorrector {
  private maxDrift: number = 0.5;
  private corrections: number = 0;

  check(expectedPosition: number, actualPosition: number): DriftReport {
    const drift = actualPosition - expectedPosition;

    if (Math.abs(drift) <= this.maxDrift) {
      return {
        currentPosition: actualPosition,
        expectedPosition,
        drift,
        correction: 0,
        correctedPosition: actualPosition,
      };
    }

    const correction = -drift;
    this.corrections++;

    return {
      currentPosition: actualPosition,
      expectedPosition,
      drift,
      correction,
      correctedPosition: actualPosition + correction,
    };
  }

  getCorrectionCount(): number {
    return this.corrections;
  }

  reset(): void {
    this.corrections = 0;
  }
}

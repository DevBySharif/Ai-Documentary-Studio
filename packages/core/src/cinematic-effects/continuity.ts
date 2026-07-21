import type { CEContinuityReport } from "./types.js";

export class CEContinuityPreservationEngine {
  private previousBrightness: number | null = null;
  private previousColorShift: number | null = null;

  compare(
    currentBrightness: number,
    currentColorTemp: number,
    currentGrainIntensity: number,
    currentLightingScore: number
  ): CEContinuityReport {
    const brightnessChange = this.previousBrightness !== null ? Math.abs(currentBrightness - this.previousBrightness) : 0;
    const colorShift = this.previousColorShift !== null ? Math.abs(currentColorTemp - this.previousColorShift) : 0;
    const lightingMatch = this.previousBrightness !== null ? 1 - Math.abs(currentLightingScore - 0.5) * 2 : 1;

    this.previousBrightness = currentBrightness;
    this.previousColorShift = currentColorTemp;

    const passed = brightnessChange < 0.3 && colorShift < 20 && currentGrainIntensity < 0.2 && lightingMatch > 0.5;

    return {
      brightnessChange: Math.round(brightnessChange * 100) / 100,
      colorShift: Math.round(colorShift * 100) / 100,
      grainConsistency: currentGrainIntensity,
      lightingMatch: Math.round(lightingMatch * 100) / 100,
      transitionDiscontinuity: !passed,
      passed
    };
  }

  reset(): void {
    this.previousBrightness = null;
    this.previousColorShift = null;
  }
}

import type { VisualFatigueReport } from "./types.js";

export class VisualFatigueDetector {
  detect(
    cutCount: number,
    motionCount: number,
    effectCount: number,
    cameraChangeCount: number,
    totalDuration: number
  ): VisualFatigueReport {
    const durationMinutes = Math.max(1, totalDuration / 60);
    const cutsPerMinute = cutCount / durationMinutes;
    const motionsPerMinute = motionCount / durationMinutes;

    const rapidCuts = Math.max(0, cutsPerMinute - 8);
    const excessiveMotion = motionsPerMinute > 6;
    const frequentChanges = cameraChangeCount / durationMinutes > 4;

    const fatigueLevel = Math.min(100, Math.round(
      (rapidCuts * 10) + (excessiveMotion ? 25 : 0) + (frequentChanges ? 20 : 0) + (effectCount > durationMinutes * 2 ? 15 : 0)
    ));

    let recommendedAction: string;
    if (fatigueLevel >= 60) {
      recommendedAction = "Significantly reduce cut and motion frequency. Add visual breathing.";
    } else if (fatigueLevel >= 30) {
      recommendedAction = "Reduce motion density. Insert stillness moments.";
    } else {
      recommendedAction = "Rhythm balanced. No action needed.";
    }

    return {
      fatigueLevel,
      rapidCuts: Math.round(rapidCuts),
      excessiveMotion,
      frequentChanges,
      recommendedAction,
    };
  }
}

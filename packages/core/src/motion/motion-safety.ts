import type { MotionSafetyReport } from "./types.js";

export class MotionSafetyChecker {
  check(
    motionType: string,
    intensity: string,
    duration: number
  ): MotionSafetyReport {
    const warnings: string[] = [];

    const rapidChanges = motionType.includes("shake") || (intensity === "extreme" && duration < 2);
    if (rapidChanges) {
      warnings.push("Rapid direction changes may cause discomfort");
    }

    const sicknessRisk = (intensity === "high" || intensity === "extreme") && duration > 5;
    if (sicknessRisk) {
      warnings.push("Extended high-intensity motion may cause motion sickness");
    }

    return {
      faceCropping: false,
      objectCropping: false,
      subtitleCollision: false,
      rapidDirectionChanges: rapidChanges,
      motionSickness: sicknessRisk,
      passed: warnings.length === 0,
      warnings,
    };
  }
}

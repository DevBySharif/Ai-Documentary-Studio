import type { RetentionPrediction } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { MotionTimeline } from "../editor/types.js";

export class RetentionPredictionEngine {
  predict(script: StoryScript, motionTimeline: MotionTimeline): RetentionPrediction {
    const slowSections: number[] = [];
    const overloadedSections: number[] = [];

    for (const scene of script.scenes) {
      if (scene.estimatedDuration > 15) {
        slowSections.push(scene.sceneNumber);
      }
      if (scene.narration.length > 5 && scene.estimatedDuration < 8) {
        overloadedSections.push(scene.sceneNumber);
      }
    }

    const motionCount = motionTimeline.clips.length;
    const sceneCount = script.scenes.length;
    const motionsPerScene = sceneCount > 0 ? motionCount / sceneCount : 0;

    const repeatedVisuals = motionsPerScene < 0.5 ? 1 : 0;

    const firstScene = script.scenes[0];
    const hookStrong = firstScene?.purpose === "hook" &&
      firstScene.narration.some((s) => s.emotion === "curiosity" || s.emotion === "surprise");

    const lastScene = script.scenes[script.scenes.length - 1];
    const endingStrong = lastScene?.purpose === "cta";

    const estimatedRetention = this.calculateRetention(
      slowSections.length,
      overloadedSections.length,
      hookStrong,
      endingStrong,
      repeatedVisuals
    );

    return {
      viewerDropRisk: this.calculateDropRisk(slowSections.length, hookStrong),
      slowSections,
      overloadedSections,
      repeatedVisuals,
      weakCuriosity: !hookStrong,
      weakEnding: !endingStrong,
      estimatedRetention,
    };
  }

  private calculateDropRisk(slowCount: number, hookStrong: boolean): number {
    let risk = 20;
    if (!hookStrong) risk += 30;
    risk += slowCount * 10;
    return Math.min(100, risk);
  }

  private calculateRetention(
    slowCount: number,
    overloadedCount: number,
    hookStrong: boolean,
    endingStrong: boolean,
    repeatedVisuals: number
  ): number {
    let retention = 80;
    if (hookStrong) retention += 10;
    if (endingStrong) retention += 5;
    retention -= slowCount * 5;
    retention -= overloadedCount * 3;
    retention -= repeatedVisuals * 10;
    return Math.max(0, Math.min(100, retention));
  }
}

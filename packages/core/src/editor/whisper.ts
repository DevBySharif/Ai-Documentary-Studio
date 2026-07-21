import type { Whispersync, MotionClip, MotionType, Easing, MotionIntensity } from "./types.js";
import type { EmotionTag } from "../story/types.js";

export class WhisperSyncEngine {
  private sync: Whispersync | null = null;

  load(sync: Whispersync): void {
    this.sync = sync;
  }

  getSentenceTimings(): Array<{ text: string; start: number; end: number }> {
    return this.sync?.sentences || [];
  }

  getWordTimings(): Array<{ word: string; start: number; end: number }> {
    return this.sync?.words || [];
  }

  getSceneTimings(): Array<{ index: number; start: number; end: number }> {
    return this.sync?.scenes || [];
  }

  alignMotionToWords(
    sceneIndex: number,
    motion: MotionType,
    intensity: MotionIntensity,
    emotion: EmotionTag,
    easing: Easing
  ): MotionClip[] {
    if (!this.sync) return [];

    const sceneWords = this.sync.words.filter((w) => {
      const sceneTiming = this.sync!.scenes.find((s) => s.index === sceneIndex);
      return sceneTiming && w.start >= sceneTiming.start && w.end <= sceneTiming.end;
    });

    if (sceneWords.length === 0) return [];

    const clips: MotionClip[] = [{
      scene: sceneIndex,
      motion,
      start: sceneWords[0].start,
      end: sceneWords[sceneWords.length - 1].end,
      easing,
      intensity,
      emotion,
    }];

    return clips;
  }

  alignTransitionToBoundary(
    fromSceneIndex: number,
    toSceneIndex: number
  ): { transitionPoint: number; duration: number } | null {
    if (!this.sync) return null;

    const fromScene = this.sync.scenes.find((s) => s.index === fromSceneIndex);
    const toScene = this.sync.scenes.find((s) => s.index === toSceneIndex);

    if (!fromScene || !toScene) return null;

    return {
      transitionPoint: fromScene.end,
      duration: toScene.start - fromScene.end,
    };
  }

  getEmphasisWords(importanceThreshold: number): Array<{ word: string; start: number; end: number }> {
    if (!this.sync) return [];
    return this.sync.words.filter((w) => {
      const duration = w.end - w.start;
      return duration > importanceThreshold;
    });
  }
}

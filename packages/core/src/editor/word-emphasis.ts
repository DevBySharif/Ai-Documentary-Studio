import type { WordEmphasisMotion, MotionClip, MotionType, MotionIntensity, Easing } from "./types.js";
import type { EmotionTag } from "../story/types.js";

export class WordEmphasisMotionEngine {
  private config: WordEmphasisMotion;

  constructor(config: WordEmphasisMotion) {
    this.config = config;
  }

  generateClips(
    emphasisWords: Array<{ word: string; start: number; end: number }>,
    sceneIndex: number,
    emotion: EmotionTag
  ): MotionClip[] {
    if (!this.config.enabled || emphasisWords.length === 0) return [];

    const clips: MotionClip[] = [];

    for (const ew of emphasisWords) {
      clips.push({
        scene: sceneIndex,
        motion: "hold",
        start: ew.start - this.config.pauseBefore,
        end: ew.start,
        easing: "ease_out",
        intensity: "minimal",
        emotion,
      });

      clips.push({
        scene: sceneIndex,
        motion: this.config.motionType,
        start: ew.start,
        end: ew.start + this.config.pushDuration,
        easing: "ease_in_out",
        intensity: this.config.intensity,
        emotion,
        wordInsert: ew,
      });

      clips.push({
        scene: sceneIndex,
        motion: "hold",
        start: ew.start + this.config.pushDuration,
        end: ew.start + this.config.pushDuration + this.config.insertDuration,
        easing: "ease_in",
        intensity: "minimal",
        emotion,
      });

      clips.push({
        scene: sceneIndex,
        motion: "pull_out",
        start: ew.start + this.config.pushDuration + this.config.insertDuration,
        end: ew.start + this.config.pushDuration + this.config.insertDuration + this.config.returnDuration,
        easing: "ease_out",
        intensity: "low",
        emotion,
      });
    }

    return clips;
  }
}

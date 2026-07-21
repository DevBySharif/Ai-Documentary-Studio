import type { RhythmProfile, BreathingPattern, MotionType, MotionClip, EmotionTag } from "./types.js";

export class RhythmEngine {
  private profile: RhythmProfile;

  constructor(profile: RhythmProfile) {
    this.profile = profile;
  }

  calculateCuts(totalDuration: number, storySpeed: "fast" | "slow" | "normal"): number {
    const rate = storySpeed === "fast" ? this.profile.fastStoryCutsPerMinute :
      storySpeed === "slow" ? this.profile.slowStoryHoldsPerMinute :
      this.profile.defaultCutsPerMinute;
    return Math.round((totalDuration / 60) * rate);
  }

  clipDuration(totalDuration: number, cutCount: number): number {
    if (cutCount <= 0) return totalDuration;
    return totalDuration / cutCount;
  }
}

export class VisualBreathing {
  private pattern: BreathingPattern;

  constructor(pattern: BreathingPattern) {
    this.pattern = pattern;
  }

  generateBreathingClips(
    sceneIndex: number,
    emotion: EmotionTag,
    duration: number
  ): MotionClip[] {
    const clips: MotionClip[] = [];
    let currentTime = 0;

    if (!this.pattern.repeat) {
      return this.singleBreath(sceneIndex, emotion, duration);
    }

    while (currentTime < duration) {
      const breathDuration = this.pattern.stillness +
        this.pattern.smallMotion +
        this.pattern.pushDuration +
        this.pattern.holdAfterPush +
        this.pattern.panDuration;

      if (currentTime + breathDuration > duration) {
        clips.push({
          scene: sceneIndex,
          motion: "hold",
          start: currentTime,
          end: duration,
          easing: "ease_in_out",
          intensity: "minimal",
          emotion,
        });
        break;
      }

      clips.push({
        scene: sceneIndex,
        motion: "hold",
        start: currentTime,
        end: currentTime + this.pattern.stillness,
        easing: "linear",
        intensity: "minimal",
        emotion,
      });
      currentTime += this.pattern.stillness;

      clips.push({
        scene: sceneIndex,
        motion: "drift",
        start: currentTime,
        end: currentTime + this.pattern.smallMotion,
        easing: "ease_in_out",
        intensity: "minimal",
        emotion,
      });
      currentTime += this.pattern.smallMotion;

      clips.push({
        scene: sceneIndex,
        motion: "push_in",
        start: currentTime,
        end: currentTime + this.pattern.pushDuration,
        easing: "ease_in",
        intensity: "low",
        emotion,
      });
      currentTime += this.pattern.pushDuration;

      clips.push({
        scene: sceneIndex,
        motion: "hold",
        start: currentTime,
        end: currentTime + this.pattern.holdAfterPush,
        easing: "ease_out",
        intensity: "minimal",
        emotion,
      });
      currentTime += this.pattern.holdAfterPush;

      clips.push({
        scene: sceneIndex,
        motion: "pan_right",
        start: currentTime,
        end: currentTime + this.pattern.panDuration,
        easing: "ease_in_out",
        intensity: "minimal",
        emotion,
      });
      currentTime += this.pattern.panDuration;
    }

    return clips;
  }

  private singleBreath(
    sceneIndex: number,
    emotion: EmotionTag,
    _duration: number
  ): MotionClip[] {
    return [
      { scene: sceneIndex, motion: "hold", start: 0, end: this.pattern.stillness, easing: "linear", intensity: "minimal", emotion },
      { scene: sceneIndex, motion: "drift", start: this.pattern.stillness, end: this.pattern.stillness + this.pattern.smallMotion, easing: "ease_in_out", intensity: "minimal", emotion },
      { scene: sceneIndex, motion: "push_in", start: this.pattern.stillness + this.pattern.smallMotion, end: this.pattern.stillness + this.pattern.smallMotion + this.pattern.pushDuration, easing: "ease_in", intensity: "low", emotion },
    ];
  }
}

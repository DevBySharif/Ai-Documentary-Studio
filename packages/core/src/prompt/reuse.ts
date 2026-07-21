import type { ReuseAction, CameraAngle, MotionSuggestion } from "./types.js";

const REUSE_QUEUE: ReuseAction[] = [
  "reuse",
  "zoom_in",
  "pan",
  "zoom_out",
  "crop",
  "rotate",
  "motion",
  "lighting_shift",
  "continue",
];

export class ImageReuseEngine {
  private reuseCounts = new Map<number, number>();
  private actionSequence = new Map<number, number>();

  determineAction(
    sourceScene: number,
    conceptChanged: boolean,
    emotionChanged: boolean,
    intentChanged: boolean
  ): { action: ReuseAction; needsNew: boolean } {
    if (conceptChanged || intentChanged) {
      this.reuseCounts.set(sourceScene, 0);
      this.actionSequence.set(sourceScene, 0);
      return { action: "new", needsNew: true };
    }

    const currentCount = this.reuseCounts.get(sourceScene) || 0;
    const sequenceIndex = this.actionSequence.get(sourceScene) || 0;
    const action = REUSE_QUEUE[sequenceIndex % REUSE_QUEUE.length];

    this.reuseCounts.set(sourceScene, currentCount + 1);
    this.actionSequence.set(sourceScene, sequenceIndex + 1);

    return { action, needsNew: false };
  }

  suggestMotion(action: ReuseAction): MotionSuggestion {
    switch (action) {
      case "reuse": return "static";
      case "zoom_in": return "slow_push_in";
      case "zoom_out": return "slow_pull_out";
      case "pan": return "gentle_pan";
      case "crop": return "ken_burns_in";
      case "rotate": return "slider";
      case "motion": return "tracking";
      case "lighting_shift": return "static";
      case "continue": return "static";
      case "new": return "slow_push_in";
    }
  }

  suggestCamera(action: ReuseAction, originalCamera: CameraAngle): CameraAngle {
    if (action === "new") return originalCamera;
    if (action === "zoom_in") {
      const zooms: Record<string, CameraAngle> = {
        wide_shot: "medium_shot",
        medium_shot: "close_up",
        close_up: "extreme_close_up",
      };
      return zooms[originalCamera] || originalCamera;
    }
    if (action === "zoom_out") {
      const zooms: Record<string, CameraAngle> = {
        extreme_close_up: "close_up",
        close_up: "medium_shot",
        medium_shot: "wide_shot",
      };
      return zooms[originalCamera] || originalCamera;
    }
    return originalCamera;
  }

  resetReuse(sceneIndex: number): void {
    this.reuseCounts.delete(sceneIndex);
    this.actionSequence.delete(sceneIndex);
  }

  getReuseCount(sceneIndex: number): number {
    return this.reuseCounts.get(sceneIndex) || 0;
  }
}

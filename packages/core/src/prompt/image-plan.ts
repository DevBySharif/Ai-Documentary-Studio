import type { ScenePrompt } from "./types.js";
import type { ImagePlan, ImagePlanEntry, ImageType, ReuseAction, CameraAngle, MotionSuggestion } from "./types.js";

export class ImagePlanBuilder {
  build(prompts: ScenePrompt[]): ImagePlan {
    const entries: ImagePlanEntry[] = [];
    let totalNewImages = 0;
    let totalReuses = 0;
    let totalWordVisuals = 0;

    for (const p of prompts) {
      const action: ReuseAction = p.reuse ? (p.reuseAction || "reuse") : "new";
      const entry: ImagePlanEntry = {
        sceneIndex: p.sceneIndex,
        sentenceIndex: p.sceneIndex,
        visualConcept: p.concepts[0] || "unknown",
        imageType: p.imageType,
        action,
        reuseSource: p.reuseSourceScene,
        camera: p.camera,
        motion: p.motion,
        estimatedDuration: p.estimatedDuration,
      };

      if (action === "new") totalNewImages++;
      else totalReuses++;

      if (p.imageType === "word_visual") {
        totalWordVisuals++;
        entry.imageType = "word_visual";
      }

      entries.push(entry);
    }

    return {
      entries,
      totalNewImages,
      totalReuses,
      totalWordVisuals,
    };
  }
}

export class ZennVisualRhythm {
  apply(prompts: ScenePrompt[]): ScenePrompt[] {
    const result: ScenePrompt[] = [];

    for (let i = 0; i < prompts.length; i++) {
      const current = { ...prompts[i] };
      const prev = i > 0 ? result[i - 1] : null;

      if (prev) {
        const sameConcept = current.concepts.some((c) => prev.concepts.includes(c));
        if (sameConcept && current.imageType !== "word_visual") {
          current.reuse = true;
          current.reuseSourceScene = prev.sceneIndex;
          current.reuseAction = this.selectRhythmAction(i);
        }

        if (current.imageType === "master_scene" && prev.imageType === "master_scene") {
          current.reuse = true;
          current.reuseSourceScene = prev.sceneIndex;
          current.reuseAction = "pan";
        }
      }

      if (current.imageType === "word_visual") {
        current.reuse = false;
      }

      result.push(current);
    }

    return result;
  }

  private selectRhythmAction(index: number): ReuseAction {
    const rhythm: ReuseAction[] = ["reuse", "zoom_in", "pan", "motion", "lighting_shift"];
    return rhythm[index % rhythm.length];
  }
}

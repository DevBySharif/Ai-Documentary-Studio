import type { CategoryScore } from "./types.js";
import type { PromptPlan, ScenePrompt, ScenePromptOutput } from "../prompt/types.js";
import type { VisualDNAProfile } from "../vda/types.js";
import { ConsistencyEngine } from "../vda/consistency.js";

function toScenePrompt(output: ScenePromptOutput): ScenePrompt {
  return {
    sceneIndex: output.scene,
    imageType: output.image_type,
    prompt: output.prompt,
    negativePrompt: output.negative_prompt,
    reuse: output.reuse,
    camera: output.camera,
    motion: output.motion,
    lighting: "soft_diffuse",
    artStyleLock: {
      artStyle: "vector_flat",
      colorPalette: [],
      primaryColors: [],
      accentColors: [],
      backgroundStyle: "solid_color",
      lighting: "soft_diffuse",
      cameraStyle: "medium_shot",
      composition: "rule_of_thirds",
      perspective: "flat",
      outlineThickness: "none",
      negativeSpace: "balanced",
    },
    estimatedDuration: output.estimated_duration,
    concepts: ["general"],
    emotion: "calm",
  };
}

export class ImageQualityInspector {
  private consistency: ConsistencyEngine;

  constructor() {
    this.consistency = new ConsistencyEngine();
  }

  inspect(plan: PromptPlan, vda?: VisualDNAProfile): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    if (plan.scenePrompts.length === 0) {
      return { score: 0, maxScore: 100, passed: false, warnings: [], failures: ["No scene prompts found"] };
    }

    const hasWordVisuals = plan.wordPrompts.length > 0;
    if (!hasWordVisuals) {
      score -= 5;
      warnings.push("No word-level visuals planned");
    }

    const imageTypes = new Set(plan.scenePrompts.map((p) => p.image_type));
    if (imageTypes.size < 2) {
      score -= 5;
      warnings.push("Limited image type variety — consider adding symbolic or word visuals");
    }

    if (vda) {
      const prompts = plan.scenePrompts.map(toScenePrompt);
      const consistencyChecks = this.consistency.check(prompts, vda);

      const failCount = consistencyChecks.filter((c) => c.status === "fail").length;
      if (failCount > 0) {
        score -= failCount * 10;
        failures.push(`${failCount} consistency checks failed`);
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      maxScore: 100,
      passed: score >= 70,
      warnings,
      failures,
    };
  }
}

export class VisualContinuityInspector {
  inspect(plan: PromptPlan): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    const prompts = plan.scenePrompts;
    if (prompts.length < 2) {
      return { score, maxScore: 100, passed: true, warnings: ["Too few scenes for continuity check"], failures: [] };
    }

    let cameraRepeatCount = 0;

    for (let i = 1; i < prompts.length; i++) {
      if (prompts[i].camera === prompts[i - 1].camera) cameraRepeatCount++;
    }

    if (cameraRepeatCount > prompts.length * 0.6) {
      score -= 10;
      warnings.push("Camera angles repeating too frequently");
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      maxScore: 100,
      passed: score >= 70,
      warnings,
      failures,
    };
  }
}

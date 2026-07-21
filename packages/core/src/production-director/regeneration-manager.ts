import type { PDRegenerationPlan, PDEngineType } from "./types.js";

export class PDRegenerationManager {
  plan(affectedEngine: PDEngineType, issue: string): PDRegenerationPlan {
    const scope = issue === "critical" ? "full" : issue === "dna" ? "dependent" : "single";
    const components = [affectedEngine];

    if (scope === "dependent") {
      if (affectedEngine === "prompt") components.push("image_approval");
      if (affectedEngine === "image_approval") components.push("motion");
      if (affectedEngine === "timeline") components.push("motion", "subtitle", "effects");
    }
    if (scope === "full") {
      components.push("script", "prompt", "image_approval", "voice", "timeline", "motion", "subtitle", "effects", "qa", "export");
    }

    return { affectedComponents: [...new Set(components)], scope, estimatedTime: components.length * 120 };
  }

  regenerateOnly(plan: PDRegenerationPlan): string[] {
    return plan.affectedComponents;
  }
}

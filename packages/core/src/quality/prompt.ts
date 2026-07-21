import type { CategoryScore } from "./types.js";
import type { PromptPlan } from "../prompt/types.js";

export class PromptQualityInspector {
  inspect(plan: PromptPlan): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    const prompts = plan.scenePrompts;
    if (prompts.length === 0) {
      return { score: 0, maxScore: 100, passed: false, warnings: [], failures: ["No prompts generated"] };
    }

    const shortPrompts = prompts.filter((p) => p.prompt.length < 30);
    if (shortPrompts.length > 0) {
      score -= shortPrompts.length * 5;
      warnings.push(`${shortPrompts.length} prompts are too short`);
    }

    const hasReuse = prompts.some((p) => p.reuse);
    if (!hasReuse) {
      score -= 10;
      warnings.push("No image reuse planned — consider reusing to reduce generation");
    }

    const newImages = prompts.filter((p) => !p.reuse).length;
    const reuseCount = prompts.filter((p) => p.reuse).length;
    const total = prompts.length;
    const reuseRatio = total > 0 ? reuseCount / total : 0;

    if (reuseRatio < 0.2 && total > 3) {
      score -= 10;
      warnings.push(`Low reuse ratio (${Math.round(reuseRatio * 100)}%) — consider more reuse`);
    }

    const wordPrompts = plan.wordPrompts;
    if (wordPrompts.length === 0) {
      score -= 5;
      warnings.push("No word-level prompts generated");
    }

    if (plan.metadata.validated) score += 5;

    const uniqueCameras = new Set(prompts.map((p) => p.camera));
    if (uniqueCameras.size < 2) {
      score -= 5;
      warnings.push("Limited camera angle variety");
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

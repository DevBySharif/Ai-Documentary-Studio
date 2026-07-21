import type { CameraDirectorPlan, CameraPathSegment, CameraTarget, CognitiveCameraTarget } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class CameraDirectorAI {
  private lastTargets: CameraTarget[] = [];

  direct(segment: SemanticSegment, availableTargets: CognitiveCameraTarget[]): CameraDirectorPlan {
    const sorted = availableTargets.sort((a, b) => b.totalScore - a.totalScore);
    const best = sorted[0];

    const target = best?.target ?? "environment";
    const label = best?.label ?? segment.concept.primary;

    this.lastTargets.push(target);
    if (this.lastTargets.length > 5) this.lastTargets.shift();

    const repeatCount = this.lastTargets.filter((t) => t === target).length;
    const adjustedTarget = repeatCount > 3 ? (sorted[1]?.target ?? target) : target;
    const adjustedLabel = repeatCount > 3 ? (sorted[1]?.label ?? label) : label;

    const path: CameraPathSegment[] = [];
    const duration = segment.end - segment.start;

    path.push({
      motion: "hold",
      start: segment.start,
      end: segment.start + duration * 0.2,
      easing: "linear",
      speed: 0,
      intensity: "low",
      target: adjustedTarget,
      targetLabel: adjustedLabel,
    });

    path.push({
      motion: segment.isReveal ? "push_in" : "hold",
      start: segment.start + duration * 0.2,
      end: segment.end,
      easing: "cinematic_ease",
      speed: segment.isReveal ? 0.4 : 0,
      intensity: segment.isReveal ? "medium" : "low",
      target: adjustedTarget,
      targetLabel: adjustedLabel,
    });

    return {
      target: adjustedTarget,
      targetLabel: adjustedLabel,
      path,
      reason: repeatCount > 3
        ? `Avoiding repetitive framing of ${target}, switching to ${adjustedTarget}`
        : `Camera directed at "${adjustedLabel}" (score: ${best?.totalScore ?? 0})`,
      confidence: best ? Math.min(1, best.totalScore / 100) : 0.5,
    };
  }
}

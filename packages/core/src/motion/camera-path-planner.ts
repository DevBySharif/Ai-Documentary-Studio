import type { CameraPath, CameraPathSegment, CameraTarget, EasingType } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class CameraPathPlanner {
  plan(segment: SemanticSegment, previousEmotion: string, imageDuration: number): CameraPath {
    const segments: CameraPathSegment[] = [];
    const target = this.determineTarget(segment);
    const easing = this.determineEasing(segment);

    if (segment.isQuestion) {
      segments.push({ motion: "push_in", start: segment.start, end: segment.start + imageDuration * 0.3, easing, speed: 0.3, intensity: "low", target, targetLabel: segment.concept.primary });
      segments.push({ motion: "hold", start: segment.start + imageDuration * 0.3, end: segment.start + imageDuration * 0.7, easing: "linear", speed: 0, intensity: "low", target, targetLabel: segment.concept.primary });
      segments.push({ motion: "drift", start: segment.start + imageDuration * 0.7, end: segment.end, easing: "ease_in_out", speed: 0.2, intensity: "minimal", target, targetLabel: segment.concept.primary });
    } else if (segment.isReveal) {
      segments.push({ motion: "hold", start: segment.start, end: segment.start + imageDuration * 0.2, easing: "linear", speed: 0, intensity: "low", target, targetLabel: segment.concept.primary });
      segments.push({ motion: "push_in", start: segment.start + imageDuration * 0.2, end: segment.start + imageDuration * 0.6, easing, speed: 0.5, intensity: "medium", target, targetLabel: segment.concept.primary });
      segments.push({ motion: "hold", start: segment.start + imageDuration * 0.6, end: segment.end, easing: "linear", speed: 0, intensity: "low", target, targetLabel: segment.concept.primary });
    } else if (segment.emotion === "reflection") {
      segments.push({ motion: "drift", start: segment.start, end: segment.end, easing: "ease_in_out", speed: 0.15, intensity: "minimal", target, targetLabel: segment.concept.primary });
    } else if (segment.emotion === "wonder") {
      segments.push({ motion: "slow_zoom_in", start: segment.start, end: segment.end, easing, speed: 0.2, intensity: "low", target, targetLabel: segment.concept.primary });
    } else {
      segments.push({ motion: "hold", start: segment.start, end: segment.end, easing: "linear", speed: 0, intensity: "low", target, targetLabel: segment.concept.primary });
    }

    return {
      id: `path_${segment.index}`,
      start: segment.start,
      end: segment.end,
      segments,
      totalDuration: imageDuration,
    };
  }

  private determineTarget(segment: SemanticSegment): CameraTarget {
    if (segment.isMetaphor) return "symbol";
    if (segment.importance >= 8) return "main_object";
    if (segment.visualIntent === "emphasize") return "highlighted_word";
    return "environment";
  }

  private determineEasing(segment: SemanticSegment): EasingType {
    if (segment.isReveal) return "ease_in_out";
    if (segment.emotion === "reflection" || segment.emotion === "calm") return "cinematic_ease";
    return "ease_in_out";
  }
}

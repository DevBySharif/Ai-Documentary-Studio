import type { MultiStagePath } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class MultiStagePathBuilder {
  build(segment: SemanticSegment, imageDuration: number): MultiStagePath {
    const stages: MultiStagePath["stages"] = [];

    if (imageDuration > 8) {
      const holdEnd = segment.start + imageDuration * 0.15;
      const pushEnd = segment.start + imageDuration * 0.45;
      const panEnd = segment.start + imageDuration * 0.65;
      const hold2End = segment.start + imageDuration * 0.85;

      stages.push({ motion: "hold", start: segment.start, end: holdEnd, easing: "linear", description: "Initial hold" });
      stages.push({ motion: "push_in", start: holdEnd, end: pushEnd, easing: "cinematic_ease", description: "Slow reveal push" });
      stages.push({ motion: "pan_right", start: pushEnd, end: panEnd, easing: "ease_in_out", description: "Gentle exploration pan" });
      stages.push({ motion: "hold", start: panEnd, end: hold2End, easing: "linear", description: "Comprehension pause" });
      stages.push({ motion: "slow_zoom_in", start: hold2End, end: segment.end, easing: "cinematic_ease", description: "Final emphasis zoom" });
    } else if (imageDuration > 5) {
      stages.push({ motion: "hold", start: segment.start, end: segment.start + imageDuration * 0.3, easing: "linear", description: "Initial hold" });
      stages.push({ motion: "push_in", start: segment.start + imageDuration * 0.3, end: segment.start + imageDuration * 0.7, easing: "cinematic_ease", description: "Push for emphasis" });
      stages.push({ motion: "hold", start: segment.start + imageDuration * 0.7, end: segment.end, easing: "linear", description: "Final hold" });
    } else {
      stages.push({ motion: "hold", start: segment.start, end: segment.end, easing: "linear", description: "Static hold" });
      if (segment.importance >= 7) {
        stages.push({ motion: "drift", start: segment.start + imageDuration * 0.5, end: segment.end, easing: "ease_in_out", description: "Subtle drift" });
      }
    }

    return { stages, totalDuration: imageDuration };
  }
}

import type { VisualBreathingResult } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class VisualBreathingEngine {
  generate(segments: SemanticSegment[]): VisualBreathingResult {
    const moments: VisualBreathingResult["moments"] = [];

    for (const seg of segments) {
      if (seg.emotion === "reflection" || seg.emotion === "calm") {
        const midPoint = seg.start + (seg.end - seg.start) * 0.5;
        moments.push({ start: seg.start, end: seg.start + 0.5, type: "stillness" });
        moments.push({ start: midPoint, end: midPoint + 1, type: "drift" });
        moments.push({ start: seg.end - 0.5, end: seg.end, type: "pause" });
      } else if (seg.isReveal) {
        moments.push({ start: seg.start + 0.3, end: seg.start + 0.8, type: "pause" });
      } else if (seg.isQuestion) {
        moments.push({ start: seg.start + (seg.end - seg.start) * 0.6, end: seg.end, type: "drift" });
      }
    }

    const totalBreathingTime = moments.reduce((s, m) => s + (m.end - m.start), 0);

    return { moments, totalBreathingTime: Math.round(totalBreathingTime * 10) / 10 };
  }
}

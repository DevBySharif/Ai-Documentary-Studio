import type { PILPrediction, PILOptimization } from "./types.js";
import type { MotionTimeline } from "../editor/types.js";

export class MotionOptimizer {
  analyze(timeline: MotionTimeline): { predictions: PILPrediction[]; optimizations: PILOptimization[] } {
    const predictions: PILPrediction[] = [];
    const optimizations: PILOptimization[] = [];

    if (timeline.clips.length === 0) {
      predictions.push({
        category: "motion_missing",
        risk: 90,
        recommendation: "No motion clips generated",
        automatic: false,
      });
      return { predictions, optimizations };
    }

    const holdClips = timeline.clips.filter((c) => c.motion === "hold").length;
    const holdRatio = holdClips / timeline.clips.length;

    if (holdRatio > 0.8) {
      predictions.push({
        category: "motion_variety",
        risk: 55,
        recommendation: `${Math.round(holdRatio * 100)}% clips are holds — consider adding camera motion`,
        automatic: true,
      });

      optimizations.push({
        target: "hold_ratio",
        originalValue: Math.round(holdRatio * 100),
        optimizedValue: Math.round(holdRatio * 70),
        improvement: "Convert some holds to gentle push-ins or pans for visual variety",
        expectedGain: 10,
      });
    }

    let motionRepeatCount = 0;
    for (let i = 2; i < timeline.clips.length; i++) {
      if (
        timeline.clips[i].motion === timeline.clips[i - 1].motion &&
        timeline.clips[i - 1].motion === timeline.clips[i - 2].motion
      ) {
        motionRepeatCount++;
      }
    }

    if (motionRepeatCount > 3) {
      predictions.push({
        category: "motion_repetition",
        risk: 40,
        recommendation: "Same motion type repeated excessively — vary camera movement",
        automatic: true,
      });
    }

    const extremeMotions = timeline.clips.filter((c) => c.intensity === "extreme" || c.intensity === "high").length;
    if (extremeMotions > timeline.clips.length * 0.3) {
      predictions.push({
        category: "motion_intensity",
        risk: 50,
        recommendation: "Too many high-intensity motions for documentary style",
        automatic: true,
      });
    }

    return { predictions, optimizations };
  }
}

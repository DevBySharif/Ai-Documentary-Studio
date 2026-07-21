import type { PILPrediction, PILOptimization } from "./types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import type { MotionTimeline } from "../editor/types.js";

export class SyncOptimizer {
  analyze(audio: AudioIntelligenceResult, motionTimeline: MotionTimeline): { predictions: PILPrediction[]; optimizations: PILOptimization[] } {
    const predictions: PILPrediction[] = [];
    const optimizations: PILOptimization[] = [];

    const audioDuration = audio.metadata.duration;
    const motionDuration = motionTimeline.totalDuration;

    if (Math.abs(audioDuration - motionDuration) > 5) {
      predictions.push({
        category: "sync_duration",
        risk: 65,
        recommendation: `Audio (${audioDuration}s) and motion (${motionDuration}s) duration mismatch`,
        automatic: false,
      });

      optimizations.push({
        target: "motion_duration",
        originalValue: motionDuration,
        optimizedValue: audioDuration,
        improvement: "Align motion timeline to audio duration for perfect sync",
        expectedGain: 15,
      });
    }

    const syncCount = audio.syncPoints.length;
    if (syncCount < motionTimeline.clips.length * 0.3) {
      predictions.push({
        category: "sync_density",
        risk: 40,
        recommendation: "Low sync point density — scenes may feel disconnected from audio",
        automatic: false,
      });
    }

    const emphasisWords = audio.emphasis.length;
    const wordInserts = motionTimeline.clips.filter((c) => c.wordInsert).length;
    if (emphasisWords > 0 && wordInserts === 0) {
      predictions.push({
        category: "word_emphasis_sync",
        risk: 50,
        recommendation: `${emphasisWords} emphasized words have no motion emphasis`,
        automatic: true,
      });
    }

    return { predictions, optimizations };
  }
}

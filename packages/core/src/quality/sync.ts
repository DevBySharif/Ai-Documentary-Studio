import type { CategoryScore } from "./types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import type { MotionTimeline } from "../editor/types.js";

export class SynchronizationQualityInspector {
  inspect(audio: AudioIntelligenceResult, motionTimeline: MotionTimeline): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    const syncPoints = audio.syncPoints;
    if (syncPoints.length === 0) {
      score -= 20;
      failures.push("No synchronization points generated");
    }

    const emphasisWords = audio.emphasis;
    const motionWordInserts = motionTimeline.clips.filter((c) => c.wordInsert);
    if (emphasisWords.length > 0 && motionWordInserts.length === 0) {
      score -= 15;
      warnings.push(`${emphasisWords.length} emphasized words but no motion word inserts found`);
    }

    const audioDuration = audio.metadata.duration;
    const motionDuration = motionTimeline.totalDuration;
    const durationDiff = Math.abs(audioDuration - motionDuration);
    if (durationDiff > 5) {
      score -= 10;
      warnings.push(`Audio (${audioDuration}s) and motion (${motionDuration}s) duration mismatch`);
    }

    if (audio.subtitles.length === 0) {
      score -= 10;
      failures.push("No subtitles generated");
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

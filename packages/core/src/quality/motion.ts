import type { CategoryScore } from "./types.js";
import type { MotionTimeline } from "../editor/types.js";

export class MotionQualityInspector {
  inspect(timeline: MotionTimeline): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    if (timeline.clips.length === 0) {
      return { score: 0, maxScore: 100, passed: false, warnings: [], failures: ["No motion clips generated"] };
    }

    const holdClips = timeline.clips.filter((c) => c.motion === "hold");
    const nonHoldClips = timeline.clips.filter((c) => c.motion !== "hold");

    if (nonHoldClips.length === 0) {
      score -= 10;
      warnings.push("All clips are holds — no camera motion planned");
    }

    const extremeMotions = timeline.clips.filter((c) => c.intensity === "extreme" || c.intensity === "high");
    if (extremeMotions.length > 0) {
      score -= extremeMotions.length * 5;
      warnings.push(`${extremeMotions.length} high/extreme intensity motions — may feel over-animated`);
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
    if (motionRepeatCount > 2) {
      score -= 10;
      warnings.push(`Motion type repeated ${motionRepeatCount + 2} times consecutively`);
    }

    const wordInserts = timeline.clips.filter((c) => c.wordInsert).length;
    if (wordInserts > 0) score += 5;

    return {
      score: Math.max(0, Math.min(100, score)),
      maxScore: 100,
      passed: score >= 70,
      warnings,
      failures,
    };
  }
}

export class TimelineQualityInspector {
  inspect(timeline: MotionTimeline, expectedDuration: number): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    const durationDiff = Math.abs(timeline.totalDuration - expectedDuration);
    if (durationDiff > expectedDuration * 0.2) {
      score -= 15;
      failures.push(`Timeline duration (${timeline.totalDuration}s) differs from expected (${expectedDuration}s)`);
    }

    const gaps: number[] = [];
    for (let i = 1; i < timeline.clips.length; i++) {
      const gap = timeline.clips[i].start - timeline.clips[i - 1].end;
      if (gap > 2.0) gaps.push(gap);
    }

    if (gaps.length > 0) {
      score -= Math.min(15, gaps.length * 3);
      warnings.push(`${gaps.length} gaps > 2s detected in timeline`);
    }

    if (timeline.clips.length < 3) {
      score -= 10;
      warnings.push("Very few timeline clips — may feel static");
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

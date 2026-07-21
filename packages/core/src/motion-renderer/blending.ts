import type { MRMotionPreset, MRMotionBlend, MRCameraPath, MRMultiStageSegment } from "./types.js";

export class MRMotionBlending {
  blend(motions: MRMotionPreset[], weights: number[], totalDuration: number): MRMotionBlend {
    const framesPerMotion = Math.floor(30 * totalDuration / motions.length);
    const segments: MRMultiStageSegment[] = motions.map((motion, i) => ({
      type: motion,
      startFrame: i * framesPerMotion,
      endFrame: (i + 1) * framesPerMotion,
      curve: "ease_in_out" as const,
      params: { weight: weights[i] ?? 0.5 }
    }));

    const blendedPath: MRCameraPath = {
      segments,
      totalDuration,
      totalFrames: segments.length > 0 ? segments[segments.length - 1].endFrame : 0
    };

    return { motions, weights, blendedPath };
  }

  crossFade(pathA: MRMultiStageSegment[], pathB: MRMultiStageSegment[], fadeFrames: number): MRMultiStageSegment[] {
    const lastA = pathA[pathA.length - 1];
    const firstB = pathB[0];
    if (!lastA || !firstB) return [...pathA, ...pathB];

    const fade: MRMultiStageSegment = {
      type: "hold",
      startFrame: lastA.endFrame,
      endFrame: lastA.endFrame + fadeFrames,
      curve: "ease_in_out",
      params: { fadeProgress: 0 }
    };

    const shiftedB = pathB.map((s) => ({
      ...s,
      startFrame: s.startFrame + fadeFrames,
      endFrame: s.endFrame + fadeFrames
    }));

    return [...pathA, fade, ...shiftedB];
  }
}

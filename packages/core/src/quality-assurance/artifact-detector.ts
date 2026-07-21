import type { QAArtifactReport, QAArtifactType } from "./types.js";

export class QAArtifactDetector {
  private readonly thresholds: Record<QAArtifactType, number> = {
    compression: 0.3, ghosting: 0.2, flicker: 0.15, banding: 0.25, aliasing: 0.2, droppedFrames: 0.05, duplicateFrames: 0.05
  };

  detect(scores: Record<QAArtifactType, number>): QAArtifactReport {
    const types: QAArtifactType[] = ["compression", "ghosting", "flicker", "banding", "aliasing", "droppedFrames", "duplicateFrames"];
    let totalIssues = 0;

    for (const t of types) {
      if ((scores[t] ?? 0) > this.thresholds[t]) totalIssues++;
    }

    const overall = Math.round((1 - totalIssues / types.length) * 100);
    return {
      compression: scores.compression, ghosting: scores.ghosting, flicker: scores.flicker,
      banding: scores.banding, aliasing: scores.aliasing, droppedFrames: scores.droppedFrames,
      duplicateFrames: scores.duplicateFrames, overall, hasIssues: totalIssues > 0
    };
  }

  getThreshold(type: QAArtifactType): number {
    return this.thresholds[type];
  }
}

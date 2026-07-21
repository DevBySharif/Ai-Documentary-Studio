import type { QASyncReport } from "./types.js";

export class QASyncValidation {
  validate(voiceToSubtitle: number, subtitleToMotion: number, motionToScene: number, sceneToTransition: number): QASyncReport {
    const scores = [voiceToSubtitle, subtitleToMotion, motionToScene, sceneToTransition];
    const allSynced = scores.every((s) => s >= 0.95);
    const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 100);

    return { voiceToSubtitle, subtitleToMotion, motionToScene, sceneToTransition, overall, allSynced };
  }

  isFrameAccurate(report: QASyncReport): boolean {
    return report.allSynced && report.overall >= 95;
  }
}

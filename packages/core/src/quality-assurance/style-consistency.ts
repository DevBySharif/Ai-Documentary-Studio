import type { QAStyleReport, QAStyleDimension, QAIssue } from "./types.js";

export class QAStyleConsistency {
  private reference: Record<QAStyleDimension, number> = {
    colorStyle: 1, motionStyle: 1, subtitleStyle: 1, cameraStyle: 1, lightingStyle: 1, visualIdentity: 1
  };

  setReference(dimension: QAStyleDimension, value: number): void {
    this.reference[dimension] = value;
  }

  compareScene(sceneScores: Record<QAStyleDimension, number>): QAStyleReport {
    const dims: QAStyleDimension[] = ["colorStyle", "motionStyle", "subtitleStyle", "cameraStyle", "lightingStyle", "visualIdentity"];
    const dimScores: Record<string, number> = {};
    const deviations: string[] = [];

    for (const dim of dims) {
      const ref = this.reference[dim];
      const scene = sceneScores[dim] ?? 0;
      const diff = Math.abs(ref - scene);
      dimScores[dim] = Math.round((1 - diff) * 100);
      if (diff > 0.2) deviations.push(`${dim} deviates by ${Math.round(diff * 100)}%`);
    }

    const overall = Math.round(Object.values(dimScores).reduce((s, v) => s + v, 0) / dims.length);

    return {
      colorStyle: dimScores.colorStyle, motionStyle: dimScores.motionStyle,
      subtitleStyle: dimScores.subtitleStyle, cameraStyle: dimScores.cameraStyle,
      lightingStyle: dimScores.lightingStyle, visualIdentity: dimScores.visualIdentity,
      overall, deviations
    };
  }

  isConsistent(report: QAStyleReport, threshold: number): boolean {
    return report.deviations.length === 0 || report.overall >= threshold;
  }
}

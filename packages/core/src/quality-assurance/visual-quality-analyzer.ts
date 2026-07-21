import type { QAVisualReport, QAIssue } from "./types.js";

export class QAVisualQualityAnalyzer {
  analyze(sharpness: number, stability: number, colorConsistency: number, lighting: number, artifacts: number, noise: number, compression: number): QAVisualReport {
    const issues: QAIssue[] = [];
    if (sharpness < 0.7) issues.push({ type: "sharpness", severity: "warning", description: "Image sharpness below threshold", autoFixable: true, autoFixed: false, suggestedFix: "Apply sharpening filter" });
    if (stability < 0.7) issues.push({ type: "frame_stability", severity: "warning", description: "Frame instability detected", autoFixable: true, autoFixed: false, suggestedFix: "Enable stabilization" });
    if (artifacts > 0.3) issues.push({ type: "artifacts", severity: "warning", description: "Visual artifacts detected", autoFixable: false, autoFixed: false, suggestedFix: "Reduce compression or increase bitrate" });

    const overall = Math.round((sharpness + stability + colorConsistency + lighting + (1 - artifacts) + (1 - noise) + compression) / 7 * 100) / 100;
    return { sharpness, frameStability: stability, colorConsistency, lighting, artifacts, noise, compressionQuality: compression, overall: Math.round(overall * 100), issues };
  }

  getOverall(report: QAVisualReport): number {
    return report.overall;
  }
}

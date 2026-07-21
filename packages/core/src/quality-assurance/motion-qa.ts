import type { QAMotionReport, QAIssue } from "./types.js";

export class QAMotionQA {
  analyze(smoothness: number, speed: number, parallax: number, zoom: number, continuity: number): QAMotionReport {
    const issues: QAIssue[] = [];
    if (smoothness < 0.7) issues.push({ type: "camera_smoothness", severity: "warning", description: "Camera movement not smooth", autoFixable: true, autoFixed: false, suggestedFix: "Apply motion smoothing" });
    if (parallax < 0.7) issues.push({ type: "parallax_stability", severity: "warning", description: "Parallax layer instability", autoFixable: true, autoFixed: false, suggestedFix: "Stabilize parallax layers" });
    if (continuity < 0.7) issues.push({ type: "motion_continuity", severity: "warning", description: "Motion continuity break detected", autoFixable: false, autoFixed: false, suggestedFix: "Review motion transition between scenes" });

    const overall = Math.round((smoothness + speed + parallax + zoom + continuity) / 5 * 100) / 100;
    return { cameraSmoothness: smoothness, motionSpeed: speed, parallaxStability: parallax, zoomQuality: zoom, motionContinuity: continuity, overall: Math.round(overall * 100), issues };
  }
}

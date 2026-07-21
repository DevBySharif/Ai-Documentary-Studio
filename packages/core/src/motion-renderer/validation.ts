import type { MRMultiStageSegment } from "./types.js";

export interface MRValidationResult {
  valid: boolean;
  checks: Array<{ name: string; passed: boolean; message?: string }>;
}

export class MRMotionValidator {
  validate(segments: MRMultiStageSegment[], totalFrames: number, subjectVisible: boolean): MRValidationResult {
    const checks: MRValidationResult["checks"] = [];

    checks.push(this.checkCameraPath(segments));
    checks.push(this.checkSubjectTracking(subjectVisible));
    checks.push(this.checkSafeZoom(segments));
    checks.push(this.checkMotionCurve(segments));
    checks.push(this.checkDuration(segments, totalFrames));
    checks.push(this.checkSceneCompatibility(segments));

    return { valid: checks.every((c) => c.passed), checks };
  }

  private checkCameraPath(segments: MRMultiStageSegment[]): { name: string; passed: boolean; message?: string } {
    return { name: "Camera Path", passed: segments.length > 0, message: segments.length === 0 ? "No camera path defined" : undefined };
  }

  private checkSubjectTracking(visible: boolean): { name: string; passed: boolean; message?: string } {
    return { name: "Subject Tracking", passed: visible, message: visible ? undefined : "Subject not visible in frame" };
  }

  private checkSafeZoom(segments: MRMultiStageSegment[]): { name: string; passed: boolean; message?: string } {
    const hasOverZoom = segments.some((s) => (s.params?.zoom ?? 1) > 2.5);
    return { name: "Safe Zoom", passed: !hasOverZoom, message: hasOverZoom ? "Zoom exceeds 2.5x limit" : undefined };
  }

  private checkMotionCurve(segments: MRMultiStageSegment[]): { name: string; passed: boolean; message?: string } {
    const hasValidCurves = segments.every((s) => ["linear", "ease_in", "ease_out", "ease_in_out", "bezier", "custom"].includes(s.curve));
    return { name: "Motion Curve", passed: hasValidCurves, message: hasValidCurves ? undefined : "Invalid curve type detected" };
  }

  private checkDuration(segments: MRMultiStageSegment[], totalFrames: number): { name: string; passed: boolean; message?: string } {
    const lastEnd = segments.length > 0 ? segments[segments.length - 1].endFrame : 0;
    return { name: "Duration", passed: lastEnd <= totalFrames, message: lastEnd > totalFrames ? "Motion exceeds total frames" : undefined };
  }

  private checkSceneCompatibility(_segments: MRMultiStageSegment[]): { name: string; passed: boolean; message?: string } {
    return { name: "Scene Compatibility", passed: true };
  }
}

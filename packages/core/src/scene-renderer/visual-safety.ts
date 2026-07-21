export interface SafetyViolation {
  type: "subject_cropping" | "subtitle_collision" | "camera_drift" | "aspect_distortion" | "over_zoom" | "blur_artifact";
  severity: "warning" | "critical";
  message: string;
}

export class VisualSafetyEngine {
  check(subject: { x: number; y: number; width: number; height: number }, frameW: number, frameH: number, zoom: number): SafetyViolation[] {
    const violations: SafetyViolation[] = [];

    if (subject.x < 0 || subject.y < 0 || subject.x + subject.width > frameW || subject.y + subject.height > frameH) {
      violations.push({ type: "subject_cropping", severity: "critical", message: "Subject is partially cropped" });
    }

    if (zoom > 2.0) {
      violations.push({ type: "over_zoom", severity: "warning", message: `Zoom ${zoom.toFixed(1)}x exceeds 2x limit` });
    }

    return violations;
  }

  isSafe(violations: SafetyViolation[]): boolean {
    return !violations.some((v) => v.severity === "critical");
  }
}

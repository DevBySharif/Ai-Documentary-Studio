import type { StabilizerReport } from "./types.js";

export class SmartSceneStabilizer {
  private previousFrame: { x: number; y: number; zoom: number } | null = null;

  analyze(currentX: number, currentY: number, currentZoom: number, subjectBox: { x: number; y: number; width: number; height: number }, frameW: number, frameH: number): StabilizerReport {
    const issues: string[] = [];
    const excessiveZoom = currentZoom > 2.5;
    const unsafeCropping = subjectBox.x < 0 || subjectBox.y < 0 || subjectBox.x + subjectBox.width > frameW || subjectBox.y + subjectBox.height > frameH;
    let abruptFraming = false;
    let cameraJitter = false;
    let compositionDrift = false;

    if (this.previousFrame) {
      const dx = Math.abs(currentX - this.previousFrame.x);
      const dy = Math.abs(currentY - this.previousFrame.y);
      const dZoom = Math.abs(currentZoom - this.previousFrame.zoom);
      abruptFraming = dx > frameW * 0.3 || dy > frameH * 0.3;
      cameraJitter = (dx < 2 && dy < 2 && dx > 0.1) && (this.detectJitter(currentX, currentY));
      compositionDrift = dZoom > 0.3 && currentZoom > 1.5;
    }

    this.previousFrame = { x: currentX, y: currentY, zoom: currentZoom };

    if (excessiveZoom) issues.push("Excessive zoom detected");
    if (abruptFraming) issues.push("Abrupt framing change");
    if (cameraJitter) issues.push("Camera jitter detected");
    if (compositionDrift) issues.push("Composition drift detected");
    if (unsafeCropping) issues.push("Unsafe cropping detected");

    return { excessiveZoom, abruptFraming, cameraJitter, compositionDrift, unsafeCropping, issues };
  }

  private detectJitter(x: number, y: number): boolean {
    const jitterThreshold = 0.5;
    const dx = x - (this.previousFrame?.x ?? x);
    const dy = y - (this.previousFrame?.y ?? y);
    return Math.abs(dx) < jitterThreshold && Math.abs(dy) < jitterThreshold;
  }

  reset(): void {
    this.previousFrame = null;
  }
}

import { MRCameraCurveEngine } from "./curve.js";

export class MRMotionSmoothing {
  private curve = new MRCameraCurveEngine();

  smoothSpeed(currentSpeed: number, targetSpeed: number, smoothingFactor = 0.1): number {
    return currentSpeed + (targetSpeed - currentSpeed) * smoothingFactor;
  }

  smoothDirection(currentAngle: number, targetAngle: number, smoothingFactor = 0.05): number {
    let diff = targetAngle - currentAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return currentAngle + diff * smoothingFactor;
  }

  smoothZoom(currentZoom: number, targetZoom: number, curve: "ease_in" | "ease_out" | "ease_in_out" = "ease_in_out", t: number): number {
    const factor = this.curve.evaluate(curve, t);
    return currentZoom + (targetZoom - currentZoom) * factor;
  }

  applyTransitionCurve(values: number[], curve: "ease_in" | "ease_out" | "ease_in_out" = "ease_in_out"): number[] {
    return values.map((v, i) => {
      const t = values.length > 1 ? i / (values.length - 1) : 0;
      return v * this.curve.evaluate(curve, t);
    });
  }
}

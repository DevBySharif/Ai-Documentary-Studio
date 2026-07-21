import type { MRCurveType } from "./types.js";

export class MRCameraCurveEngine {
  evaluate(curve: MRCurveType, t: number): number {
    t = Math.max(0, Math.min(1, t));
    switch (curve) {
      case "linear": return t;
      case "ease_in": return t * t;
      case "ease_out": return t * (2 - t);
      case "ease_in_out": return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case "bezier": return this.bezier(t, 0.25, 0.1, 0.25, 1);
      case "custom": return t;
    }
  }

  private bezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  }

  getVelocity(curve: MRCurveType, t: number): number {
    const dt = 0.001;
    const v1 = this.evaluate(curve, t);
    const v2 = this.evaluate(curve, t + dt);
    return (v2 - v1) / dt;
  }

  isSmooth(curve: MRCurveType, samples = 20): boolean {
    let prevV = this.getVelocity(curve, 0);
    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      const v = this.getVelocity(curve, t);
      const change = Math.abs(v - prevV);
      if (change > 1.5) return false;
      prevV = v;
    }
    return true;
  }
}

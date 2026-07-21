import { InterpolationType } from '@studio/timeline';

export class InterpolationEngine {
  /**
   * Applies easing to a normalized time value (0.0 to 1.0).
   */
  static applyEasing(t: number, easing: InterpolationType): number {
    // Clamp t between 0 and 1
    t = Math.max(0, Math.min(1, t));

    switch (easing) {
      case InterpolationType.Linear:
        return t;
      
      case InterpolationType.EaseIn:
        return t * t * t; // Cubic ease in
      
      case InterpolationType.EaseOut:
        const f = t - 1;
        return f * f * f + 1; // Cubic ease out
      
      case InterpolationType.EaseInOut:
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2; // Cubic ease in-out
      
      case InterpolationType.Bezier:
        // Placeholder for real cubic-bezier support
        return t;
        
      default:
        return t;
    }
  }

  /**
   * Interpolates between a start and end value given a normalized progress `t` (0.0 to 1.0) and an easing curve.
   */
  static interpolateValue(start: number, end: number, t: number, easing: InterpolationType = InterpolationType.Linear): number {
    const easedT = this.applyEasing(t, easing);
    return start + (end - start) * easedT;
  }
}

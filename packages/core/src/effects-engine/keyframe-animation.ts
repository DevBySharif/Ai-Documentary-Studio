import { FrameIndex } from "../timeline-engine/time";

export type InterpolationType = "Step" | "Linear" | "Bezier" | "Cubic" | "Hold";

export type EasingFunctionType =
  | "EaseIn"
  | "EaseOut"
  | "EaseInOut"
  | "Bounce"
  | "Elastic"
  | "Back"
  | "CustomCurves";

export interface MotionControlPoint {
  readonly x: number;
  readonly y: number;
}

export interface MotionPath {
  readonly id: string;
  readonly controlPoints: ReadonlyArray<MotionControlPoint>;
  readonly isCurved: boolean;
}

export interface AdvancedKeyframe {
  readonly id: string;
  readonly frame: FrameIndex;
  readonly value: number;
  readonly interpolation: InterpolationType;
  readonly easing: EasingFunctionType;
  readonly handleIn?: MotionControlPoint;
  readonly handleOut?: MotionControlPoint;
}

/**
 * Calculates easing progress [0, 1] given raw linear ratio t in [0, 1].
 */
export function applyEasing(t: number, easing: EasingFunctionType): number {
  switch (easing) {
    case "EaseIn":
      return t * t;
    case "EaseOut":
      return t * (2 - t);
    case "EaseInOut":
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case "Bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
    case "Elastic":
      return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    case "Back": {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) + 1;
    }
    case "CustomCurves":
    default:
      return t;
  }
}

export function evaluateKeyframeAnimation(
  keyframes: ReadonlyArray<AdvancedKeyframe>,
  frame: FrameIndex
): number {
  if (keyframes.length === 0) return 0;
  if (frame <= keyframes[0].frame) return keyframes[0].value;
  if (frame >= keyframes[keyframes.length - 1].frame) {
    return keyframes[keyframes.length - 1].value;
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const kA = keyframes[i];
    const kB = keyframes[i + 1];

    if (frame >= kA.frame && frame <= kB.frame) {
      if (kA.interpolation === "Hold" || kA.interpolation === "Step") return kA.value;

      const rawT = (frame - kA.frame) / (kB.frame - kA.frame);
      const easedT = applyEasing(rawT, kA.easing);

      return kA.value + easedT * (kB.value - kA.value);
    }
  }

  return 0;
}

import { FrameIndex } from "./time";

export type InterpolationStrategy =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "hold"
  | "bezier";

export interface BezierHandle {
  readonly inTangent: { x: number; y: number };
  readonly outTangent: { x: number; y: number };
}

/**
 * A single keyframe for one animated property.
 * Value is typed as number to support any scalar property.
 */
export interface Keyframe {
  readonly id: string;
  readonly frame: FrameIndex;
  readonly value: number;
  readonly interpolation: InterpolationStrategy;
  readonly bezier?: BezierHandle;
}

/**
 * A named set of keyframes for one animatable property.
 */
export interface KeyframeTrack {
  readonly propertyName: string;
  readonly keyframes: ReadonlyArray<Keyframe>;
}

/**
 * Computes the interpolated value of a property at any given frame.
 * Returns the last known value if frame is beyond the last keyframe.
 */
export function interpolateKeyframes(
  track: KeyframeTrack,
  frame: FrameIndex
): number {
  const { keyframes } = track;
  if (keyframes.length === 0) return 0;
  if (frame <= keyframes[0].frame) return keyframes[0].value;
  if (frame >= keyframes[keyframes.length - 1].frame) {
    return keyframes[keyframes.length - 1].value;
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const kA = keyframes[i];
    const kB = keyframes[i + 1];

    if (frame >= kA.frame && frame <= kB.frame) {
      if (kA.interpolation === "hold") return kA.value;

      const t = (frame - kA.frame) / (kB.frame - kA.frame);
      return kA.value + t * (kB.value - kA.value); // linear fallback
    }
  }

  return 0;
}

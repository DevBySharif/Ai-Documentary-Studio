/**
 * Frame-accurate time representation.
 * Integer frame index is the single authoritative unit.
 * All derived forms (seconds, timecode) are computed on demand.
 */
export type FrameIndex = number;

export interface Timebase {
  readonly numerator: number;
  readonly denominator: number;
}

export const TIMEBASE_23_976: Timebase = { numerator: 24000, denominator: 1001 };
export const TIMEBASE_24: Timebase = { numerator: 24, denominator: 1 };
export const TIMEBASE_25: Timebase = { numerator: 25, denominator: 1 };
export const TIMEBASE_29_97: Timebase = { numerator: 30000, denominator: 1001 };
export const TIMEBASE_30: Timebase = { numerator: 30, denominator: 1 };
export const TIMEBASE_60: Timebase = { numerator: 60, denominator: 1 };

/**
 * Returns the frame rate as a floating-point value.
 * Only used for display — never for frame index arithmetic.
 */
export function framesPerSecond(timebase: Timebase): number {
  return timebase.numerator / timebase.denominator;
}

/**
 * Converts a frame index to whole seconds (floor, lossless).
 */
export function framesToSeconds(frame: FrameIndex, timebase: Timebase): number {
  return (frame * timebase.denominator) / timebase.numerator;
}

/**
 * Converts a seconds value to the nearest frame index.
 */
export function secondsToFrames(seconds: number, timebase: Timebase): FrameIndex {
  return Math.round((seconds * timebase.numerator) / timebase.denominator);
}

/**
 * Converts a frame index to a SMPTE timecode string (HH:MM:SS:FF).
 * Drop-frame is not accounted for here — this is the non-drop-frame form.
 */
export function framesToTimecode(frame: FrameIndex, timebase: Timebase): string {
  const fps = Math.round(framesPerSecond(timebase));
  const ff = frame % fps;
  const totalSeconds = Math.floor(frame / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);

  return [hh, mm, ss, ff]
    .map(n => String(n).padStart(2, "0"))
    .join(":");
}

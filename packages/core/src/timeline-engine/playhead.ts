import { FrameIndex } from "./time";

export type PlaybackState = "Idle" | "Playing" | "Paused" | "Scrubbing";
export type PlaybackDirection = "Forward" | "Reverse";

/**
 * The authoritative playhead — exactly one per active timeline.
 */
export interface Playhead {
  readonly currentFrame: FrameIndex;
  readonly state: PlaybackState;
  readonly direction: PlaybackDirection;
  readonly speed: number; // 1.0 = real-time, 2.0 = 2x, 0.5 = half
}

export const DEFAULT_PLAYHEAD: Playhead = {
  currentFrame: 0,
  state: "Idle",
  direction: "Forward",
  speed: 1.0,
};

export function movePlayhead(
  playhead: Playhead,
  frame: FrameIndex
): Playhead {
  return { ...playhead, currentFrame: Math.max(0, frame) };
}

export function setPlaybackState(
  playhead: Playhead,
  state: PlaybackState
): Playhead {
  return { ...playhead, state };
}

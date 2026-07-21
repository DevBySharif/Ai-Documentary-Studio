import { FrameIndex } from "./time";
import { KeyframeTrack } from "./keyframe";

export interface ClipTransform {
  readonly positionX: number;
  readonly positionY: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly rotation: number;
  readonly anchorX: number;
  readonly anchorY: number;
}

export const IDENTITY_TRANSFORM: ClipTransform = {
  positionX: 0,
  positionY: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  anchorX: 0.5,
  anchorY: 0.5,
};

/**
 * A Clip is an immutable reference to a segment of an asset placed on the timeline.
 * Source media is NEVER modified. All edits manipulate these references.
 */
export interface Clip {
  readonly id: string;
  readonly assetId: string;
  readonly trackId: string;

  // Source in/out points (frames within the source asset)
  readonly sourceInFrame: FrameIndex;
  readonly sourceOutFrame: FrameIndex;

  // Timeline placement (frames on the timeline)
  readonly timelineInFrame: FrameIndex;
  readonly timelineOutFrame: FrameIndex;

  readonly playbackSpeed: number; // 1.0 = normal
  readonly transform: ClipTransform;

  readonly keyframeTracks: ReadonlyArray<KeyframeTrack>;
  readonly effectIds: ReadonlyArray<string>;

  readonly isNested: boolean; // true if this clip references another Timeline
  readonly nestedTimelineId?: string;
}

/**
 * Computed duration of a clip on the timeline (in frames).
 */
export function clipDuration(clip: Clip): number {
  return clip.timelineOutFrame - clip.timelineInFrame;
}

/**
 * Computed source duration of a clip (in frames).
 */
export function sourceDuration(clip: Clip): number {
  return clip.sourceOutFrame - clip.sourceInFrame;
}

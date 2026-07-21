import { FrameIndex } from "./time";
import { ClipTransform } from "./clip";
import { MarkerType } from "./marker";
import { TrackType } from "./track";

/**
 * CQRS Commands — every edit operation is a typed command.
 * Commands integrate with Undo/Redo (IB Vol 02 Part 9).
 */

// ─── Track Commands ───────────────────────────────────────────────────────────

export interface AddTrackCommand {
  readonly type: "AddTrack";
  readonly trackType: TrackType;
  readonly name: string;
}

export interface RemoveTrackCommand {
  readonly type: "RemoveTrack";
  readonly trackId: string;
}

// ─── Clip Commands ────────────────────────────────────────────────────────────

export interface AddClipCommand {
  readonly type: "AddClip";
  readonly assetId: string;
  readonly trackId: string;
  readonly timelineInFrame: FrameIndex;
  readonly sourceInFrame: FrameIndex;
  readonly sourceOutFrame: FrameIndex;
}

export interface RemoveClipCommand {
  readonly type: "RemoveClip";
  readonly clipId: string;
}

export interface MoveClipCommand {
  readonly type: "MoveClip";
  readonly clipId: string;
  readonly toTrackId: string;
  readonly toTimelineInFrame: FrameIndex;
}

export interface TrimClipCommand {
  readonly type: "TrimClip";
  readonly clipId: string;
  readonly newTimelineInFrame?: FrameIndex;
  readonly newTimelineOutFrame?: FrameIndex;
  readonly newSourceInFrame?: FrameIndex;
  readonly newSourceOutFrame?: FrameIndex;
}

export interface RippleTrimCommand {
  readonly type: "RippleTrim";
  readonly clipId: string;
  readonly edge: "in" | "out";
  readonly deltaFrames: number;
}

export interface RollEditCommand {
  readonly type: "RollEdit";
  readonly clipAId: string;
  readonly clipBId: string;
  readonly deltaFrames: number;
}

export interface SlipClipCommand {
  readonly type: "SlipClip";
  readonly clipId: string;
  readonly deltaFrames: number;
}

export interface SlideClipCommand {
  readonly type: "SlideClip";
  readonly clipId: string;
  readonly deltaFrames: number;
}

// ─── Marker Commands ──────────────────────────────────────────────────────────

export interface AddMarkerCommand {
  readonly type: "AddMarker";
  readonly frame: FrameIndex;
  readonly markerType: MarkerType;
  readonly label: string;
  readonly color?: string;
  readonly comment?: string;
}

export interface RemoveMarkerCommand {
  readonly type: "RemoveMarker";
  readonly markerId: string;
}

// ─── Playhead Commands ────────────────────────────────────────────────────────

export interface SeekCommand {
  readonly type: "Seek";
  readonly frame: FrameIndex;
}

export interface PlayCommand {
  readonly type: "Play";
  readonly speed?: number;
}

export interface PauseCommand {
  readonly type: "Pause";
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type TimelineCommand =
  | AddTrackCommand
  | RemoveTrackCommand
  | AddClipCommand
  | RemoveClipCommand
  | MoveClipCommand
  | TrimClipCommand
  | RippleTrimCommand
  | RollEditCommand
  | SlipClipCommand
  | SlideClipCommand
  | AddMarkerCommand
  | RemoveMarkerCommand
  | SeekCommand
  | PlayCommand
  | PauseCommand;

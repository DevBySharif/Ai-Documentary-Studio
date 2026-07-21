import { FrameIndex } from "./time";

/**
 * Typed domain events emitted by every timeline mutation.
 * Drive UI updates, plugins, and diagnostics without tight coupling.
 */

export interface TimelineEventBase {
  readonly timelineId: string;
  readonly occurredAt: Date;
  readonly version: number;
}

export interface ClipAddedEvent extends TimelineEventBase {
  readonly type: "ClipAdded";
  readonly clipId: string;
  readonly trackId: string;
  readonly timelineInFrame: FrameIndex;
}

export interface ClipRemovedEvent extends TimelineEventBase {
  readonly type: "ClipRemoved";
  readonly clipId: string;
  readonly trackId: string;
}

export interface ClipTrimmedEvent extends TimelineEventBase {
  readonly type: "ClipTrimmed";
  readonly clipId: string;
  readonly previousInFrame: FrameIndex;
  readonly previousOutFrame: FrameIndex;
  readonly newInFrame: FrameIndex;
  readonly newOutFrame: FrameIndex;
}

export interface ClipMovedEvent extends TimelineEventBase {
  readonly type: "ClipMoved";
  readonly clipId: string;
  readonly fromTrackId: string;
  readonly toTrackId: string;
  readonly fromFrame: FrameIndex;
  readonly toFrame: FrameIndex;
}

export interface TrackCreatedEvent extends TimelineEventBase {
  readonly type: "TrackCreated";
  readonly trackId: string;
}

export interface TrackRemovedEvent extends TimelineEventBase {
  readonly type: "TrackRemoved";
  readonly trackId: string;
}

export interface MarkerAddedEvent extends TimelineEventBase {
  readonly type: "MarkerAdded";
  readonly markerId: string;
  readonly frame: FrameIndex;
}

export interface PlaybackStartedEvent extends TimelineEventBase {
  readonly type: "PlaybackStarted";
  readonly fromFrame: FrameIndex;
}

export interface PlaybackStoppedEvent extends TimelineEventBase {
  readonly type: "PlaybackStopped";
  readonly atFrame: FrameIndex;
}

export type TimelineEvent =
  | ClipAddedEvent
  | ClipRemovedEvent
  | ClipTrimmedEvent
  | ClipMovedEvent
  | TrackCreatedEvent
  | TrackRemovedEvent
  | MarkerAddedEvent
  | PlaybackStartedEvent
  | PlaybackStoppedEvent;

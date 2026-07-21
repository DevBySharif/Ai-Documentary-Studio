import { FrameIndex, Timebase, TIMEBASE_25 } from "./time";
import { Track } from "./track";
import { Clip } from "./clip";
import { Marker } from "./marker";
import { Playhead, DEFAULT_PLAYHEAD } from "./playhead";

/**
 * The Timeline — root aggregate of the NLE.
 * Immutable: every edit produces a new Timeline instance.
 */
export interface Timeline {
  readonly id: string;
  readonly name: string;
  readonly timebase: Timebase;
  readonly durationFrames: FrameIndex;
  readonly tracks: ReadonlyArray<Track>;
  readonly clips: ReadonlyMap<string, Clip>;
  readonly markers: ReadonlyArray<Marker>;
  readonly playhead: Playhead;
  readonly version: number;
  readonly isMagneticTimelineEnabled: boolean;
  readonly snappingEnabled: boolean;
}

/**
 * Factory — creates an empty Timeline with sane defaults.
 */
export function createTimeline(
  id: string,
  name: string,
  timebase: Timebase = TIMEBASE_25
): Timeline {
  return {
    id,
    name,
    timebase,
    durationFrames: 0,
    tracks: [],
    clips: new Map(),
    markers: [],
    playhead: DEFAULT_PLAYHEAD,
    version: 1,
    isMagneticTimelineEnabled: true,
    snappingEnabled: true,
  };
}

/**
 * Recomputes timeline duration as the maximum outFrame among all clips.
 */
export function computeTimelineDuration(timeline: Timeline): FrameIndex {
  let max = 0;
  for (const clip of Array.from(timeline.clips.values())) {
    if (clip.timelineOutFrame > max) max = clip.timelineOutFrame;
  }
  return max;
}


export const enum TrackType {
  Video = "Video",
  Audio = "Audio",
  Subtitle = "Subtitle",
  Graphics = "Graphics",
  Effects = "Effects",
  Adjustment = "Adjustment",
  Marker = "Marker",
}

/**
 * A single track in the timeline. Immutable — edits produce new Track instances.
 */
export interface Track {
  readonly id: string;
  readonly type: TrackType;
  readonly name: string;
  readonly index: number;
  readonly isLocked: boolean;
  readonly isVisible: boolean;
  readonly isMuted: boolean;
  readonly isSolo: boolean;
  readonly opacity: number; // 0–1
  readonly clipIds: ReadonlyArray<string>;
}

export function createTrack(
  id: string,
  type: TrackType,
  name: string,
  index: number
): Track {
  return {
    id,
    type,
    name,
    index,
    isLocked: false,
    isVisible: true,
    isMuted: false,
    isSolo: false,
    opacity: 1,
    clipIds: [],
  };
}

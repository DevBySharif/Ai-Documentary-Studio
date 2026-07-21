import { FrameIndex } from "./time";

export type MarkerType =
  | "Timeline"
  | "Clip"
  | "Chapter"
  | "AiSuggestion"
  | "Review";

/**
 * A Marker is metadata anchored to a frame position on the timeline.
 */
export interface Marker {
  readonly id: string;
  readonly type: MarkerType;
  readonly frame: FrameIndex;
  readonly label: string;
  readonly color: string;
  readonly comment?: string;
  readonly createdAt: Date;
}

export function createMarker(
  id: string,
  type: MarkerType,
  frame: FrameIndex,
  label: string,
  color = "#FFD700"
): Marker {
  return { id, type, frame, label, color, createdAt: new Date() };
}

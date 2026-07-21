import { FrameIndex } from "../timeline-engine/time";

export type TransitionType =
  | "Cut"
  | "CrossDissolve"
  | "Fade"
  | "Wipe"
  | "Slide"
  | "Zoom"
  | "Push"
  | "CustomPlugin";

export type TransitionAlignment = "CenterAtCut" | "StartAtCut" | "EndAtCut";

/**
 * Transition Model (IB Part 16 - Section 7, 8).
 * Operates on clip boundaries to blend incoming and outgoing frames.
 */
export interface TransitionModel {
  readonly id: string;
  readonly type: TransitionType;
  readonly durationFrames: number;
  readonly alignment: TransitionAlignment;
  readonly incomingClipId: string;
  readonly outgoingClipId: string;
  readonly parameters: ReadonlyMap<string, number | string | boolean>;
}

export function evaluateTransitionProgress(
  currentFrame: FrameIndex,
  cutFrame: FrameIndex,
  transition: TransitionModel
): number {
  let startFrame: number;

  switch (transition.alignment) {
    case "StartAtCut":
      startFrame = cutFrame;
      break;
    case "EndAtCut":
      startFrame = cutFrame - transition.durationFrames;
      break;
    case "CenterAtCut":
    default:
      startFrame = cutFrame - Math.floor(transition.durationFrames / 2);
      break;
  }

  if (currentFrame < startFrame) return 0;
  if (currentFrame >= startFrame + transition.durationFrames) return 1;

  return (currentFrame - startFrame) / transition.durationFrames;
}

import { MotionAssignment, TransitionType } from "./composer-types";

/**
 * Motion & Transition Planner (Vol 04 Part 09 - Section 9, Section 10, Section 11, Section 14).
 * Assigns storytelling camera motions and transition types with silence and beat awareness.
 */
export class MotionTransitionPlanner {
  public assignMotion(isDramaticPause: boolean, shotIndex: number): MotionAssignment {
    if (isDramaticPause) {
      return "SlowZoomIn"; // Hold focus during dramatic silence
    }
    return shotIndex % 2 === 0 ? "PanLeft" : "SlowZoomOut";
  }

  public selectTransition(isSceneChange: boolean, isEmotionalShift: boolean): TransitionType {
    if (isSceneChange) {
      return "Dissolve";
    }
    if (isEmotionalShift) {
      return "Fade";
    }
    return "HardCut";
  }
}

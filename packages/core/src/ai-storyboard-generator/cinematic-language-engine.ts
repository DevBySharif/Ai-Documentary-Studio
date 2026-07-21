import { CameraAngle, CompositionRule } from "./storyboard-types";

/**
 * Cinematic Language & Composition Engine (Vol 04 Part 04 - Section 7, Section 8).
 * Recommends camera angles and framing rules based on storytelling intent.
 */
export class CinematicLanguageEngine {
  public recommendCameraAngle(narrativeIntent: "Establishing" | "Intimate" | "Overview" | "Tension"): CameraAngle {
    switch (narrativeIntent) {
      case "Establishing":
        return "WideShot";
      case "Intimate":
        return "CloseUp";
      case "Overview":
        return "AerialView";
      case "Tension":
      default:
        return "SlowPushIn";
    }
  }

  public recommendComposition(style: "Symmetrical" | "Dynamic" | "Layered"): CompositionRule {
    switch (style) {
      case "Symmetrical":
        return "Symmetry";
      case "Layered":
        return "DepthLayering";
      case "Dynamic":
      default:
        return "RuleOfThirds";
    }
  }
}

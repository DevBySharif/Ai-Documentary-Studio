import { AssetReadinessStatus, ShotColorStatus } from "./storyboard-ui-types";

/**
 * Asset Readiness & Color Status Tracker (Vol 05 Part 06 - Section 12, Section 14).
 * Color codes shots (Gray, Blue, Yellow, Green, Red, Purple) and tracks asset readiness bottlenecks.
 */
export class AssetReadinessColorTracker {
  public determineColorStatus(readiness: AssetReadinessStatus, isLocked = false): ShotColorStatus {
    if (isLocked) return "Purple";
    switch (readiness) {
      case "ImageReady":
        return "Green";
      case "PromptReady":
        return "Blue";
      case "AwaitingGeneration":
        return "Yellow";
      case "NeedsReplacement":
      case "MissingAsset":
        return "Red";
      default:
        return "Gray";
    }
  }
}

import { TimelineLayerRole } from "./composer-types";

/**
 * Multi-Track Layer Organizer (Vol 04 Part 09 - Section 12).
 * Automatically maps background visuals, foregrounds, titles, subtitles, maps, and overlays to NLE track indices.
 */
export class LayerOrganizer {
  public getTrackIndexForRole(role: TimelineLayerRole): number {
    switch (role) {
      case "BackgroundVisuals":
        return 0; // V1
      case "ForegroundElements":
      case "Maps":
      case "Charts":
        return 1; // V2
      case "Overlays":
      case "Effects":
        return 2; // V3
      case "Titles":
      case "Subtitles":
        return 3; // V4
      default:
        return 0;
    }
  }
}

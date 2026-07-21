import { MotionType, VisualSourceType } from "./storyboard-types";

/**
 * B-Roll & Motion Planner (Vol 04 Part 04 - Section 10, Section 11).
 * Identifies B-roll opportunities and plans camera motion (Ken Burns, Pan, Zoom, Parallax).
 */
export class BrollAndMotionPlanner {
  public planBRollSource(abstractConcept: string): VisualSourceType {
    if (abstractConcept.includes("location") || abstractConcept.includes("geography")) {
      return "Map";
    }
    if (abstractConcept.includes("data") || abstractConcept.includes("percent")) {
      return "Chart";
    }
    return "StockVideo";
  }

  public recommendMotion(isStaticImage: boolean): MotionType {
    if (isStaticImage) {
      return "KenBurns";
    }
    return "SlowZoom";
  }
}

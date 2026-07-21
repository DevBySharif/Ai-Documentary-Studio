import type { DecisionTreeResult, ImageStrategy } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class VisualDecisionTree {
  execute(
    segment: SemanticSegment,
    previousSegment: SemanticSegment | null,
    hasMatchingImage: boolean,
    hasSymbol: boolean
  ): DecisionTreeResult {
    const meaningChanged = previousSegment === null ||
      segment.concept.primary !== previousSegment.concept.primary ||
      segment.visualIntent !== previousSegment.visualIntent;

    const emotionChanged = previousSegment === null ||
      segment.emotion !== previousSegment.emotion;

    const path: string[] = [];

    if (!meaningChanged) {
      path.push("Meaning unchanged");
      if (!emotionChanged) {
        path.push("Emotion unchanged → Hold / Motion Only");
        return {
          meaningChanged: false,
          emotionChanged: false,
          imageMatches: true,
          symbolAvailable: false,
          finalStrategy: "motion_only",
          path,
        };
      } else {
        path.push("Emotion changed → Adjust Motion");
        return {
          meaningChanged: false,
          emotionChanged: true,
          imageMatches: true,
          symbolAvailable: false,
          finalStrategy: "motion_only",
          path,
        };
      }
    }

    path.push("Meaning changed");
    if (hasMatchingImage) {
      path.push("Existing image matches → Reuse");
      return {
        meaningChanged: true,
        emotionChanged,
        imageMatches: true,
        symbolAvailable: false,
        finalStrategy: "reuse",
        path,
      };
    }

    path.push("No matching image");
    if (hasSymbol) {
      path.push("Symbol available → Symbol Insert");
      return {
        meaningChanged: true,
        emotionChanged,
        imageMatches: false,
        symbolAvailable: true,
        finalStrategy: "symbol_insert",
        path,
      };
    }

    path.push("No symbol → Generate New Image");
    return {
      meaningChanged: true,
      emotionChanged,
      imageMatches: false,
      symbolAvailable: false,
      finalStrategy: "new_image",
      path,
    };
  }
}

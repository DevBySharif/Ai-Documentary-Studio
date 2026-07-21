import type { CognitivePacingResult } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

const PROCESSING_RATE = 3.5;

export class CognitivePacingEngine {
  estimate(segment: SemanticSegment): CognitivePacingResult {
    const wordCount = segment.text.split(/\s+/).length;
    const duration = segment.end - segment.start;
    const narrationWPM = duration > 0 ? (wordCount / duration) * 60 : 0;

    const complexityFactor = segment.complexity === "highly_abstract" ? 2.5 :
      segment.complexity === "complex" ? 1.8 :
      segment.complexity === "medium" ? 1.2 : 0.8;

    const infoReceived = wordCount;
    const processingCapacity = duration * PROCESSING_RATE / complexityFactor;
    const infoProcessed = Math.min(infoReceived, Math.round(processingCapacity));

    const understood = infoProcessed >= infoReceived * 0.8;
    const shouldExtendHold = !understood && infoProcessed < infoReceived * 0.6;
    const shouldReduceMotion = !understood && cognitiveLoadIsHigh(segment);
    const shouldDelayTransition = !understood;

    const extensionNeeded = shouldExtendHold
      ? Math.round((infoReceived - infoProcessed) / PROCESSING_RATE * complexityFactor * 10) / 10
      : 0;

    return {
      segment: segment.index,
      informationReceived: infoReceived,
      informationProcessed: infoProcessed,
      understood,
      shouldExtendHold,
      shouldReduceMotion,
      shouldDelayTransition,
      recommendedHoldExtension: extensionNeeded,
    };
  }
}

function cognitiveLoadIsHigh(segment: SemanticSegment): boolean {
  return segment.complexity === "highly_abstract" || segment.complexity === "complex" || segment.importance >= 8;
}

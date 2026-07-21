import type { EmotionTag, VisualIntent, ConceptTag } from "../story/types.js";

export interface ConceptShiftResult {
  shifted: boolean;
  reasons: string[];
}

const EMOTION_BREAKPOINTS: EmotionTag[] = [
  "surprise", "urgency", "mystery", "awe",
];

export class ConceptShiftDetector {
  detect(
    prevEmotion: EmotionTag,
    currEmotion: EmotionTag,
    prevConcepts: ConceptTag[],
    currConcepts: ConceptTag[],
    prevIntent: VisualIntent,
    currIntent: VisualIntent,
    prevPurpose: string,
    currPurpose: string
  ): ConceptShiftResult {
    const reasons: string[] = [];

    if (prevPurpose !== currPurpose && this.isSignificantPurposeChange(prevPurpose, currPurpose)) {
      reasons.push("story_focus_change");
    }

    if (EMOTION_BREAKPOINTS.includes(currEmotion) && prevEmotion !== currEmotion) {
      reasons.push("significant_emotion_change");
    }

    const primaryChanged = this.primaryConceptChanged(prevConcepts, currConcepts);
    if (primaryChanged) {
      reasons.push("primary_concept_change");
    }

    if (currIntent === "new_scene" || currIntent === "wide_shot") {
      reasons.push("visual_intent_new_scene");
    }

    if (prevIntent === "new_scene" && currIntent === "image_reuse") {
      return { shifted: true, reasons };
    }

    const shifted = reasons.length > 0;
    return { shifted, reasons };
  }

  private isSignificantPurposeChange(prev: string, curr: string): boolean {
    const significantPairs = [
      ["hook", "context"], ["context", "explain"], ["explain", "evidence"],
      ["reveal", "summarize"], ["summarize", "cta"],
    ];
    return significantPairs.some(([a, b]) => (prev === a && curr === b) || (prev === b && curr === a));
  }

  private primaryConceptChanged(prev: ConceptTag[], curr: ConceptTag[]): boolean {
    const prevPrimary = prev.filter((c) => c.isPrimary).map((c) => c.term.toLowerCase());
    const currPrimary = curr.filter((c) => c.isPrimary).map((c) => c.term.toLowerCase());
    if (prevPrimary.length === 0 && currPrimary.length > 0) return true;
    if (prevPrimary.length > 0 && currPrimary.length === 0) return false;
    return prevPrimary.some((p) => !currPrimary.includes(p));
  }
}

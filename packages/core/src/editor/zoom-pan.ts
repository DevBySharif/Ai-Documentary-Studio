import type { ZoomRule, PanRule, MotionType, MotionIntensity } from "./types.js";

export class ZoomPanEngine {
  private zoomRule: ZoomRule;
  private panRule: PanRule;

  constructor(zoomRule: ZoomRule, panRule: PanRule) {
    this.zoomRule = zoomRule;
    this.panRule = panRule;
  }

  shouldZoom(context: {
    understandingIncreases: boolean;
    emotionIncreases: boolean;
    attentionShouldFocus: boolean;
    revealHappens: boolean;
  }): boolean {
    if (!this.zoomRule.allowed) return false;
    return (
      (context.understandingIncreases && this.zoomRule.triggerOnUnderstanding) ||
      (context.emotionIncreases && this.zoomRule.triggerOnEmotion) ||
      (context.attentionShouldFocus && this.zoomRule.triggerOnFocus) ||
      (context.revealHappens && this.zoomRule.triggerOnReveal)
    );
  }

  selectZoomMotion(intensity: MotionIntensity): MotionType {
    const map: Record<string, MotionType> = {
      minimal: "slow_zoom_in",
      low: "slow_zoom_in",
      medium: "push_in",
      high: "push_in",
      extreme: "push_in",
    };
    return map[intensity] || "slow_zoom_in";
  }

  shouldPan(context: {
    narrationContinues: boolean;
    environmentIsLarge: boolean;
    objectRelationshipMatters: boolean;
    journeyIsImplied: boolean;
  }): boolean {
    if (!this.panRule.allowed) return false;
    return (
      (context.narrationContinues && this.panRule.triggerOnNarrationContinue) ||
      (context.environmentIsLarge && this.panRule.triggerOnLargeEnvironment) ||
      (context.objectRelationshipMatters && this.panRule.triggerOnObjectRelation) ||
      (context.journeyIsImplied && this.panRule.triggerOnJourney)
    );
  }

  selectPanDirection(narrationContent: string): string {
    const lower = narrationContent.toLowerCase();
    if (lower.includes("left") || lower.includes("past") || lower.includes("before")) return "pan_left";
    if (lower.includes("right") || lower.includes("future") || lower.includes("next")) return "pan_right";
    if (lower.includes("up") || lower.includes("above") || lower.includes("hope")) return "pan_up";
    if (lower.includes("down") || lower.includes("below") || lower.includes("depth")) return "pan_down";
    return "pan_right";
  }
}

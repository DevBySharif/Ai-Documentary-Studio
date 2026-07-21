import type { TransitionStyle, TransitionRule, Easing } from "./types.js";
import type { EmotionTag } from "../story/types.js";

const PURPOSE_TO_TRANSITION: Record<string, TransitionStyle> = {
  hook: "cut",
  context: "slide_right",
  explain: "cut",
  reveal: "push_transition",
  evidence: "cut",
  summarize: "cross_fade",
  cta: "push_transition",
  transition: "fade",
};

const EMOTION_TO_TRANSITION: Record<string, TransitionStyle> = {
  reflection: "soft_dissolve",
  question: "cut",
  reveal: "push_transition",
  memory: "soft_dissolve",
  explanation: "cut",
  surprise: "cut",
  calm: "cross_fade",
  curiosity: "light_fade",
  wonder: "cross_fade",
};

export class CinematicTransitionEngine {
  private rules: TransitionRule[];

  constructor(rules?: TransitionRule[]) {
    this.rules = rules || [];
  }

  selectForPurpose(purpose: string): TransitionStyle {
    return PURPOSE_TO_TRANSITION[purpose] || "cut";
  }

  selectForEmotion(emotion: EmotionTag): TransitionStyle {
    return EMOTION_TO_TRANSITION[emotion] || "cut";
  }

  selectForEmotionTransition(from: EmotionTag, to: EmotionTag): { transition: TransitionStyle; duration: number; easing: Easing } {
    const rule = this.rules.find(
      (r) => r.fromEmotion === from && r.toEmotion === to
    );
    if (rule) {
      return { transition: rule.transition, duration: rule.duration, easing: rule.easing };
    }
    return { transition: "cross_fade", duration: 0.5, easing: "ease_in_out" };
  }

  selectTransitionForScene(
    purpose: string,
    emotion: EmotionTag
  ): TransitionStyle {
    return this.selectForEmotion(emotion) || this.selectForPurpose(purpose);
  }
}

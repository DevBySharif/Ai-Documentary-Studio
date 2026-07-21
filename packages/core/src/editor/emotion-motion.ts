import type { EmotionMotionRule, MotionType, MotionIntensity, TransitionStyle } from "./types.js";
import type { EmotionTag } from "../story/types.js";

const DEFAULT_EMOTION_MAP: EmotionMotionRule[] = [
  { emotion: "curiosity", motion: "push_in", intensity: "low", transition: "cut", holdModifier: 1.2, description: "Slow push-in to draw viewer into discovery" },
  { emotion: "wonder", motion: "slow_zoom_in", intensity: "minimal", transition: "cross_fade", holdModifier: 1.5, description: "Gentle zoom to emphasize awe" },
  { emotion: "mystery", motion: "drift", intensity: "minimal", transition: "fade", holdModifier: 1.8, description: "Dark hold with tiny drift for suspense" },
  { emotion: "surprise", motion: "push_in", intensity: "medium", transition: "cut", holdModifier: 0.8, description: "Quick push for surprise reveal" },
  { emotion: "fear", motion: "shake", intensity: "low", transition: "cut", holdModifier: 0.7, description: "Slight camera shake for tension" },
  { emotion: "reflection", motion: "hold", intensity: "minimal", transition: "soft_dissolve", holdModifier: 2.0, description: "Hold with gentle zoom for contemplative moments" },
  { emotion: "calm", motion: "float", intensity: "minimal", transition: "cross_fade", holdModifier: 2.5, description: "Slow floating motion for peaceful scenes" },
  { emotion: "urgency", motion: "push_in", intensity: "medium", transition: "cut", holdModifier: 0.6, description: "Faster push to convey urgency" },
  { emotion: "hope", motion: "pan_up", intensity: "low", transition: "light_fade", holdModifier: 1.3, description: "Upward camera move for hopeful feeling" },
  { emotion: "suspense", motion: "drift", intensity: "low", transition: "fade", holdModifier: 1.6, description: "Slow drift with held breath" },
  { emotion: "awe", motion: "slow_zoom_in", intensity: "minimal", transition: "cross_fade", holdModifier: 2.0, description: "Extended slow zoom for moments of awe" },
];

export class EmotionMotionMap {
  private map: Map<EmotionTag, EmotionMotionRule>;

  constructor(customRules?: EmotionMotionRule[]) {
    this.map = new Map();
    const rules = customRules && customRules.length > 0 ? customRules : DEFAULT_EMOTION_MAP;
    for (const rule of rules) {
      this.map.set(rule.emotion, rule);
    }
  }

  get(emotion: EmotionTag): EmotionMotionRule {
    return this.map.get(emotion) || this.map.get("calm") || DEFAULT_EMOTION_MAP[5];
  }

  getMotion(emotion: EmotionTag): MotionType {
    return this.get(emotion).motion;
  }

  getIntensity(emotion: EmotionTag): MotionIntensity {
    return this.get(emotion).intensity;
  }

  getTransition(emotion: EmotionTag): TransitionStyle | undefined {
    return this.get(emotion).transition;
  }

  getHoldModifier(emotion: EmotionTag): number {
    return this.get(emotion).holdModifier || 1.0;
  }

  getAll(): EmotionMotionRule[] {
    return Array.from(this.map.values());
  }

  size(): number {
    return this.map.size;
  }
}

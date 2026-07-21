import type { EditingPreset } from "./types.js";
import { EmotionMotionMap } from "./emotion-motion.js";

export function createZennMotionProfile(): EditingPreset {
  return {
    name: "Zenn-style Documentary",
    description: "Long image holds, semantic reuse, slow cinematic push-ins, gentle pans, word inserts for major concepts, smooth fade-back. Matches the reference documentary workflow.",

    defaultMotion: "slow_zoom_in",
    defaultIntensity: "minimal",
    defaultTransition: "cross_fade",

    holdRule: {
      minDuration: 2.5,
      maxDuration: 12,
      baseWordsPerSecond: 2.8,
      importanceBonus: 0.6,
      viewerProcessingTime: 0.4,
      pauseExtension: 0.8,
    },

    zoomRule: {
      allowed: true,
      triggerOnUnderstanding: true,
      triggerOnEmotion: true,
      triggerOnFocus: true,
      triggerOnReveal: true,
      minZoom: 1.0,
      maxZoom: 1.12,
      defaultSpeed: 0.25,
    },

    panRule: {
      allowed: true,
      triggerOnNarrationContinue: true,
      triggerOnLargeEnvironment: false,
      triggerOnObjectRelation: true,
      triggerOnJourney: true,
      defaultSpeed: 0.15,
      maxDistance: 0.25,
    },

    parallax: {
      enabled: true,
      foregroundSpeed: 0.08,
      middleSpeed: 0.04,
      backgroundSpeed: 0.01,
      maxDepth: 0.12,
      subtlety: 0.85,
    },

    wordEmphasis: {
      enabled: true,
      pauseBefore: 0.4,
      pushDuration: 0.7,
      insertDuration: 1.8,
      returnDuration: 0.5,
      motionType: "push_in",
      intensity: "low",
    },

    rhythm: {
      fastStoryCutsPerMinute: 10,
      slowStoryHoldsPerMinute: 3,
      defaultCutsPerMinute: 5,
      smoothingWindow: 4,
    },

    breathing: {
      stillness: 2.5,
      smallMotion: 1.8,
      pushDuration: 1.0,
      holdAfterPush: 3.0,
      panDuration: 1.5,
      repeat: true,
    },

    effects: {
      softGlow: true,
      lightRays: false,
      depthBlur: true,
      particleDust: false,
      filmGrain: false,
      lensBloom: true,
      heavyGlitch: false,
      rgbSplit: false,
      flashOveruse: false,
      tiktokEffects: false,
    },

    transitions: [
      { fromEmotion: "calm", toEmotion: "calm", transition: "cross_fade", duration: 0.8, easing: "ease_in_out" },
      { fromEmotion: "curiosity", toEmotion: "wonder", transition: "light_fade", duration: 0.6, easing: "ease_in" },
      { fromEmotion: "reflection", toEmotion: "calm", transition: "soft_dissolve", duration: 1.2, easing: "smooth_step" },
      { fromEmotion: "surprise", toEmotion: "curiosity", transition: "cut", duration: 0.3, easing: "linear" },
      { fromEmotion: "mystery", toEmotion: "surprise", transition: "push_transition", duration: 0.5, easing: "ease_in" },
    ],

    emotionMotionMap: new EmotionMotionMap().getAll(),
  };
}

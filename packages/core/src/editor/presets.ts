import type { EditingPreset } from "./types.js";
import {
  EmotionMotionMap,
} from "./emotion-motion.js";
import type { EmotionMotionRule } from "./types.js";

function baseHoldRule() {
  return {
    minDuration: 1.5,
    maxDuration: 12,
    baseWordsPerSecond: 3.0,
    importanceBonus: 0.5,
    viewerProcessingTime: 0.3,
    pauseExtension: 0.5,
  };
}

function baseZoomRule() {
  return {
    allowed: true,
    triggerOnUnderstanding: true,
    triggerOnEmotion: true,
    triggerOnFocus: true,
    triggerOnReveal: true,
    minZoom: 1.0,
    maxZoom: 1.15,
    defaultSpeed: 0.3,
  };
}

function basePanRule() {
  return {
    allowed: true,
    triggerOnNarrationContinue: true,
    triggerOnLargeEnvironment: true,
    triggerOnObjectRelation: true,
    triggerOnJourney: true,
    defaultSpeed: 0.2,
    maxDistance: 0.3,
  };
}

function baseParallax() {
  return {
    enabled: true,
    foregroundSpeed: 0.1,
    middleSpeed: 0.05,
    backgroundSpeed: 0.02,
    maxDepth: 0.15,
    subtlety: 0.8,
  };
}

function baseWordEmphasis() {
  return {
    enabled: true,
    pauseBefore: 0.3,
    pushDuration: 0.8,
    insertDuration: 1.5,
    returnDuration: 0.6,
    motionType: "push_in" as const,
    intensity: "low" as const,
  };
}

function baseRhythm() {
  return {
    fastStoryCutsPerMinute: 12,
    slowStoryHoldsPerMinute: 4,
    defaultCutsPerMinute: 8,
    smoothingWindow: 3,
  };
}

function baseBreathing() {
  return {
    stillness: 2.0,
    smallMotion: 1.5,
    pushDuration: 1.0,
    holdAfterPush: 2.5,
    panDuration: 2.0,
    repeat: true,
  };
}

function baseEffects() {
  return {
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
  };
}

export const PRESETS: Record<string, EditingPreset> = {
  documentary_calm: {
    name: "Documentary Calm",
    description: "Slow zoom, long hold, gentle drift. Standard documentary pacing.",
    defaultMotion: "slow_zoom_in",
    defaultIntensity: "minimal",
    defaultTransition: "cross_fade",
    holdRule: { ...baseHoldRule(), maxDuration: 10 },
    zoomRule: { ...baseZoomRule(), defaultSpeed: 0.2 },
    panRule: { ...basePanRule(), defaultSpeed: 0.15 },
    parallax: baseParallax(),
    wordEmphasis: { ...baseWordEmphasis(), enabled: true },
    rhythm: { ...baseRhythm(), defaultCutsPerMinute: 6 },
    breathing: baseBreathing(),
    effects: baseEffects(),
    transitions: [
      { fromEmotion: "calm", toEmotion: "calm", transition: "cross_fade", duration: 0.8, easing: "ease_in_out" },
      { fromEmotion: "curiosity", toEmotion: "calm", transition: "cross_fade", duration: 0.6, easing: "ease_out" },
      { fromEmotion: "reflection", toEmotion: "calm", transition: "soft_dissolve", duration: 1.2, easing: "smooth_step" },
    ],
    emotionMotionMap: new EmotionMotionMap().getAll(),
  },

  scientific_explain: {
    name: "Scientific Explain",
    description: "Slow push, minimal pan, stable composition. Focus on clarity.",
    defaultMotion: "push_in",
    defaultIntensity: "low",
    defaultTransition: "cut",
    holdRule: { ...baseHoldRule(), minDuration: 2.0, maxDuration: 8 },
    zoomRule: { ...baseZoomRule(), triggerOnEmotion: false },
    panRule: { ...basePanRule(), allowed: false },
    parallax: { ...baseParallax(), enabled: false },
    wordEmphasis: { ...baseWordEmphasis(), enabled: true, pushDuration: 0.6 },
    rhythm: { ...baseRhythm(), defaultCutsPerMinute: 10 },
    breathing: { ...baseBreathing(), repeat: false },
    effects: { ...baseEffects(), lightRays: true, particleDust: true },
    transitions: [
      { fromEmotion: "curiosity", toEmotion: "wonder", transition: "light_fade", duration: 0.4, easing: "ease_in" },
      { fromEmotion: "wonder", toEmotion: "calm", transition: "cut", duration: 0.3, easing: "linear" },
    ],
    emotionMotionMap: new EmotionMotionMap().getAll(),
  },

  psychological_reflection: {
    name: "Psychological Reflection",
    description: "Hold, tiny floating motion, soft fade. Introspective pacing.",
    defaultMotion: "hold",
    defaultIntensity: "minimal",
    defaultTransition: "soft_dissolve",
    holdRule: { ...baseHoldRule(), maxDuration: 14, importanceBonus: 0.8 },
    zoomRule: { ...baseZoomRule(), allowed: false },
    panRule: { ...basePanRule(), defaultSpeed: 0.1, maxDistance: 0.15 },
    parallax: { ...baseParallax(), subtlety: 0.9 },
    wordEmphasis: { ...baseWordEmphasis(), enabled: true, pauseBefore: 0.5, insertDuration: 2.0 },
    rhythm: { ...baseRhythm(), slowStoryHoldsPerMinute: 3, defaultCutsPerMinute: 4 },
    breathing: { ...baseBreathing(), stillness: 3.0, smallMotion: 2.0, holdAfterPush: 3.5 },
    effects: { ...baseEffects(), depthBlur: true, filmGrain: true },
    transitions: [
      { fromEmotion: "reflection", toEmotion: "reflection", transition: "soft_dissolve", duration: 1.5, easing: "smooth_step" },
      { fromEmotion: "calm", toEmotion: "reflection", transition: "cross_fade", duration: 1.0, easing: "ease_in_out" },
    ],
    emotionMotionMap: new EmotionMotionMap().getAll(),
  },

  discovery: {
    name: "Discovery",
    description: "Push-in, light bloom, slow transition. Reveal-oriented pacing.",
    defaultMotion: "push_in",
    defaultIntensity: "medium",
    defaultTransition: "push_transition",
    holdRule: { ...baseHoldRule(), minDuration: 1.5, maxDuration: 6 },
    zoomRule: { ...baseZoomRule(), defaultSpeed: 0.5 },
    panRule: { ...basePanRule(), defaultSpeed: 0.3 },
    parallax: { ...baseParallax(), enabled: false },
    wordEmphasis: { ...baseWordEmphasis(), enabled: true, intensity: "medium" },
    rhythm: { ...baseRhythm(), fastStoryCutsPerMinute: 15, defaultCutsPerMinute: 10 },
    breathing: { ...baseBreathing(), stillness: 1.0, smallMotion: 1.0, pushDuration: 1.5 },
    effects: { ...baseEffects(), lensBloom: true, lightRays: true },
    transitions: [
      { fromEmotion: "curiosity", toEmotion: "surprise", transition: "push_transition", duration: 0.6, easing: "ease_in" },
      { fromEmotion: "surprise", toEmotion: "wonder", transition: "cross_fade", duration: 0.8, easing: "ease_out" },
    ],
    emotionMotionMap: new EmotionMotionMap().getAll(),
  },

  mystery: {
    name: "Mystery",
    description: "Hold, dark vignette, tiny camera drift. Suspenseful pacing.",
    defaultMotion: "drift",
    defaultIntensity: "minimal",
    defaultTransition: "fade",
    holdRule: { ...baseHoldRule(), maxDuration: 15, importanceBonus: 1.0 },
    zoomRule: { ...baseZoomRule(), allowed: false },
    panRule: { ...basePanRule(), defaultSpeed: 0.08, maxDistance: 0.1 },
    parallax: { ...baseParallax(), subtlety: 0.95 },
    wordEmphasis: { ...baseWordEmphasis(), enabled: true, pauseBefore: 0.6, pushDuration: 1.0 },
    rhythm: { ...baseRhythm(), slowStoryHoldsPerMinute: 2, defaultCutsPerMinute: 3 },
    breathing: { ...baseBreathing(), stillness: 4.0, smallMotion: 2.5, holdAfterPush: 4.0 },
    effects: { ...baseEffects(), depthBlur: true },
    transitions: [
      { fromEmotion: "mystery", toEmotion: "mystery", transition: "fade", duration: 1.0, easing: "smooth_step" },
      { fromEmotion: "mystery", toEmotion: "surprise", transition: "cut", duration: 0.3, easing: "linear" },
    ],
    emotionMotionMap: new EmotionMotionMap().getAll(),
  },
};

export class PresetManager {
  get(name: string): EditingPreset | undefined {
    return PRESETS[name];
  }

  list(): string[] {
    return Object.keys(PRESETS);
  }

  getDefault(): EditingPreset {
    return PRESETS.documentary_calm;
  }
}

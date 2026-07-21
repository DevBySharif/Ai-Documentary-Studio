export type CEGradePreset = "documentary" | "cinema" | "educational" | "minimal" | "monochrome" | "custom_lut";

export type CEFilmGrainType = "fine" | "medium" | "documentary" | "archive";

export type CEAtmosphereType = "dust" | "fog" | "mist" | "floating_particles" | "smoke";

export type CETransitionType = "cross_dissolve" | "fade" | "light_fade" | "dip_to_black" | "dip_to_white" | "blur_transition" | "motion_match";

export type CEEffectQuality = "draft" | "preview" | "production" | "master";

export interface CEEffectStack {
  colorGrade: CEColorGradeConfig;
  exposure: CEExposureConfig;
  contrast: CEContrastConfig;
  lighting: CELightingConfig;
  depth: CEDepthConfig;
  atmosphere: CEAtmosphereConfig;
  lensEffects: CELensConfig;
  filmGrain: CEFilmGrainConfig;
  finalPolish: CEFinalPolishConfig;
}

export interface CEColorGradeConfig {
  preset: CEGradePreset;
  lutPath?: string;
  temperature: number;
  tint: number;
  saturation: number;
  hueShift: number;
}

export interface CEExposureConfig {
  highlights: number;
  midtones: number;
  shadows: number;
  blackPoint: number;
  whitePoint: number;
}

export interface CEContrastConfig {
  global: number;
  local: number;
  micro: number;
}

export interface CELightingConfig {
  vignette: number;
  bloom: number;
  lightRays: number;
}

export interface CEDepthConfig {
  depthOfField: number;
  focalPoint: { x: number; y: number };
  backgroundBlur: number;
}

export interface CEAtmosphereConfig {
  type: CEAtmosphereType;
  intensity: number;
  speed: number;
}

export interface CELensConfig {
  softLensBlur: number;
  lensDirt: number;
  lightWrap: number;
  lensBreathing: number;
}

export interface CEFilmGrainConfig {
  type: CEFilmGrainType;
  intensity: number;
}

export interface CEFinalPolishConfig {
  sharpness: number;
  noiseReduction: number;
  saturation: number;
}

export interface CEAIEffectDecision {
  vignette: number;
  warmth: number;
  atmosphere: CEAtmosphereType | null;
  grain: CEFilmGrainType;
  bloom: number;
  confidence: number;
}

export interface CEContinuityReport {
  brightnessChange: number;
  colorShift: number;
  grainConsistency: number;
  lightingMatch: number;
  transitionDiscontinuity: boolean;
  passed: boolean;
}

export interface CESafetyResult {
  overexposed: boolean;
  excessiveBloom: boolean;
  strongVignette: boolean;
  artificialBlur: boolean;
  distractingParticles: boolean;
  reducedReadability: boolean;
  passed: boolean;
  messages: string[];
}

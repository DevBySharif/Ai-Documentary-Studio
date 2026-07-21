import type { EmotionTag, VisualIntent, ConceptTag } from "../story/types.js";
export type { EmotionTag, VisualIntent, ConceptTag };

export type ImageType =
  | "master_scene"
  | "supporting_scene"
  | "word_visual"
  | "symbolic_visual"
  | "transition_visual";

export type ReuseAction =
  | "new"
  | "reuse"
  | "zoom_in"
  | "zoom_out"
  | "pan"
  | "crop"
  | "rotate"
  | "motion"
  | "lighting_shift"
  | "continue";

export type CameraAngle =
  | "wide_shot"
  | "medium_shot"
  | "close_up"
  | "extreme_close_up"
  | "over_shoulder"
  | "low_angle"
  | "high_angle"
  | "bird_eye"
  | "dutch_angle"
  | "eye_level";

export type MotionSuggestion =
  | "static"
  | "slow_push_in"
  | "slow_pull_out"
  | "gentle_pan"
  | "slow_zoom"
  | "tracking"
  | "slider"
  | "handheld"
  | "ken_burns_in"
  | "ken_burns_out"
  | "none";

export type LightingStyle =
  | "soft_diffuse"
  | "dramatic_side"
  | "rim_lighting"
  | "backlit"
  | "studio_soft"
  | "natural_window"
  | "moody_low_key"
  | "bright_flat"
  | "cinematic_volumetric";

export interface CharacterLock {
  characterName: string;
  clothing: string;
  bodyShape: string;
  expressionStyle: string;
  artStyle: string;
  poseRules: string[];
}

export interface ArtStyleLock {
  artStyle: string;
  colorPalette: string[];
  primaryColors: string[];
  accentColors: string[];
  backgroundStyle: string;
  lighting: LightingStyle;
  cameraStyle: string;
  composition: string;
  perspective: string;
  outlineThickness: string;
  negativeSpace: string;
}

export interface WordPrompt {
  word: string;
  category: string;
  sceneIndex: number;
  sentenceIndex: number;
  prompt: string;
  negativePrompt: string;
  visualTemplate: string;
  camera: CameraAngle;
  motion: MotionSuggestion;
  estimatedDuration: number;
}

export interface ScenePrompt {
  sceneIndex: number;
  imageType: ImageType;
  prompt: string;
  negativePrompt: string;
  reuse: boolean;
  reuseSourceScene?: number;
  reuseAction?: ReuseAction;
  camera: CameraAngle;
  motion: MotionSuggestion;
  lighting: LightingStyle;
  characterLock?: CharacterLock;
  artStyleLock: ArtStyleLock;
  estimatedDuration: number;
  concepts: string[];
  emotion: EmotionTag;
}

export interface PromptScore {
  visualClarity: number;
  consistency: number;
  flowReadiness: number;
  generationConfidence: number;
  reusePotential: number;
  overallScore: number;
}

export interface PromptValidation {
  passed: boolean;
  score: PromptScore;
  checks: Array<{
    name: string;
    status: "pass" | "warn" | "fail";
    message: string;
    score: number;
    maxScore: number;
  }>;
}

export interface ImageLibraryEntry {
  imageId: string;
  sceneId: number;
  prompt: string;
  negativePrompt: string;
  concept: string;
  character: string;
  environment: string;
  camera: CameraAngle;
  emotion: EmotionTag;
  duration: number;
  reuseCount: number;
  generatedAt: string;
  url?: string;
}

export interface Shot {
  shotNumber: number;
  sceneIndex: number;
  purpose: string;
  imageType: ImageType;
  cameraAngle: CameraAngle;
  visualMetaphor?: string;
  reuse: boolean;
  reuseSourceShot?: number;
  reuseAction?: ReuseAction;
  estimatedDuration: number;
  concept: string;
  emotion: EmotionTag;
}

export interface Storyboard {
  id: string;
  scriptId: string;
  projectId: string;
  shots: Shot[];
  totalDuration: number;
  approved: boolean;
  createdAt: string;
}

export interface ImagePlanEntry {
  sceneIndex: number;
  sentenceIndex: number;
  visualConcept: string;
  imageType: ImageType;
  action: ReuseAction;
  reuseSource?: number;
  camera: CameraAngle;
  motion: MotionSuggestion;
  estimatedDuration: number;
}

export interface ImagePlan {
  entries: ImagePlanEntry[];
  totalNewImages: number;
  totalReuses: number;
  totalWordVisuals: number;
}

export interface ScenePromptOutput {
  scene: number;
  image_type: ImageType;
  prompt: string;
  negative_prompt: string;
  reuse: boolean;
  camera: CameraAngle;
  motion: MotionSuggestion;
  estimated_duration: number;
}

export interface PromptPlan {
  scenePrompts: ScenePromptOutput[];
  wordPrompts: WordPrompt[];
  imagePlan: ImagePlan;
  storyboard: Storyboard;
  metadata: {
    id: string;
    scriptId: string;
    projectId: string;
    version: string;
    createdAt: string;
    validated: boolean;
    validationScore: number;
    totalPrompts: number;
    totalNewImages: number;
    totalReuses: number;
  };
}

export type ArtStyleValue = "minimal_documentary_stick" | "clean_vector_ink" | "line_art" | "geometric_flat" | "hand_drawn_minimal";

export type LineStyleValue = "clean_vector_ink" | "thin_consistent" | "medium_variable" | "thick_expressive";

export type LightingValue = "soft_cinematic" | "hard_dramatic" | "ambient_natural" | "backlit_moody" | "diffused_soft";

export type ContrastValue = "low" | "medium" | "high";

export type TextureValue = "flat" | "subtle_grain" | "paper_texture" | "smooth_gradient";

export type PerspectiveValue = "cinematic" | "isometric" | "flat_2d" | "birds_eye" | "first_person";

export type MoodValue = "reflective" | "calm" | "contemplative" | "dramatic" | "neutral" | "melancholy" | "hopeful";

export type CameraPerspective = "wide_shot" | "medium_shot" | "close_up" | "extreme_close_up" | "over_shoulder" | "low_angle" | "high_angle";

export type SilhouetteType = "stick_figure" | "rounded_geometric" | "angular_geometric" | "abstract_shape";

export type BackgroundStyle = "minimal_gradient" | "solid_color" | "soft_pattern" | "abstract_scene" | "clean_white" | "dark_mood";

export type AccessoryType = "glasses" | "hat" | "scarf" | "backpack" | "book" | "camera" | "microphone" | "lamp" | "candle" | "none";

export interface PermanentStyleDNA {
  artStyle: ArtStyleValue;
  lineStyle: LineStyleValue;
  lighting: LightingValue;
  contrast: ContrastValue;
  texture: TextureValue;
  perspective: PerspectiveValue;
  mood: MoodValue;
}

export interface CharacterDNAProfile {
  characterId: string;
  bodyShape: string;
  headRatio: number;
  limbLength: number;
  poseRules: string[];
  emotionRules: Record<string, string>;
  silhouette: SilhouetteType;
  accessories: AccessoryType[];
  identity: string;
}

export interface StyleLockState {
  artStyle: ArtStyleValue;
  lineWeight: string;
  background: BackgroundStyle;
  lighting: LightingValue;
  composition: string;
  camera: CameraPerspective;
  visualMood: MoodValue;
}

export interface CharacterLockState {
  face: string;
  eyes: string;
  headShape: string;
  stickProportions: string;
  movementStyle: string;
  silhouette: SilhouetteType;
}

export interface ColorLanguageState {
  base: string;
  accent: string[];
  highlights: string[];
  background: string[];
}

export interface SymbolDefinition {
  symbol: string;
  meaning: string;
  description: string;
  visualStyle: string;
  examples: string[];
}

export interface StyleValidationResult {
  styleScore: number;
  characterScore: number;
  status: "approved" | "rejected" | "needs_review";
  issues: string[];
  referenceComparison: Record<string, number>;
}

export interface CharacterValidationResult {
  silhouetteMatch: number;
  proportionMatch: number;
  identityMatch: number;
  poseMatch: number;
  expressionMatch: number;
  accessoryMatch: number;
  overallScore: number;
  passed: boolean;
  issues: string[];
}

export interface PromptSanitizationResult {
  originalPrompt: string;
  sanitizedPrompt: string;
  removedElements: string[];
  warnings: string[];
}

export interface StructuredPromptDNA {
  sceneIntent: string;
  visualIntent: string;
  styleDNA: PermanentStyleDNA;
  characterDNA: CharacterDNAProfile;
  compositionRules: string[];
  lightingRules: string[];
  negativeRules: string[];
  finalPrompt: string;
}

export interface DriftReport {
  projectId: string;
  driftDetected: boolean;
  score: number;
  changes: Array<{
    aspect: string;
    severity: "minor" | "moderate" | "major";
    detail: string;
  }>;
  affectedAssets: string[];
  recommendation: string;
}

export interface DriftThresholds {
  lineThickness: number;
  proportions: number;
  perspective: number;
  lighting: number;
  background: number;
  colorPalette: number;
}

export interface ReferenceBoardEntry {
  type: "hero_character" | "background" | "lighting" | "composition" | "camera" | "symbol" | "gold_standard";
  assetId: string;
  description: string;
  score: number;
}

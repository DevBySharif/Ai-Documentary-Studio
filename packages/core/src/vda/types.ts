export type ArtTechnique = "vector_flat" | "vector_gradient" | "hand_drawn" | "digital_paint" | "line_art" | "geometric";
export type RenderingStyle = "flat" | "shaded" | "gradient" | "textured" | "minimal";
export type OutlineStyle = "none" | "thin_black" | "medium_black" | "thick_black" | "colored";
export type ShadowStyle = "none" | "soft_drop" | "hard_drop" | "ambient_occlusion";
export type DepthStyle = "flat" | "subtle_layers" | "deep";

export type BodyStructure = "stick_figure" | "simple_geometric" | "rounded_shape" | "detailed";
export type HeadShape = "circle" | "oval" | "rounded_square" | "abstract";
export type PoseStyle = "static" | "gesturing" | "dynamic" | "profile";
export type ExpressionStyle = "minimal_abstract" | "simple_eyes" | "detailed";

export type EnvironmentType = "abstract_space" | "clean_background" | "geometric_world" | "minimal_set";
export type ObjectDensity = "minimal" | "balanced" | "detailed";
export type BackgroundComplexity = "solid_color" | "gradient" | "pattern" | "scenic";

export type LightDirection = "front" | "side" | "back" | "top" | "ambient";
export type LightIntensity = "soft" | "medium" | "strong";
export type LightMood = "warm" | "cool" | "neutral" | "dramatic" | "calm";

export type DefaultFraming = "wide_shot" | "medium_shot" | "close_up" | "extreme_close_up";

export type CompositionRule = "rule_of_thirds" | "centered" | "leading_lines" | "negative_space" | "balanced" | "asymmetric";

export type VisualPriority = "critical" | "high" | "medium" | "low";
export type ImageComplexity = "simple" | "medium" | "detailed" | "complex";

export type GrammarTransition =
  | "continue"
  | "zoom_in"
  | "zoom_out"
  | "pan_left"
  | "pan_right"
  | "pan_up"
  | "pan_down"
  | "word_insert"
  | "return"
  | "new_scene"
  | "fade_out"
  | "crossfade";

export interface ArtStyleDefinition {
  technique: ArtTechnique;
  rendering: RenderingStyle;
  illustration: string;
  outline: OutlineStyle;
  texture: string;
  shadow: ShadowStyle;
  depth: DepthStyle;
  background: BackgroundComplexity;
  qualityTarget: string;
}

export interface CharacterDNA {
  id: string;
  body: BodyStructure;
  headShape: HeadShape;
  poseStyle: PoseStyle;
  expression: ExpressionStyle;
  gestures: string[];
  walkingStyle: string;
  emotionStyle: Record<string, string>;
  scale: number;
  silhouette: string;
}

export interface EnvironmentDNA {
  type: EnvironmentType;
  objectDensity: ObjectDensity;
  backgroundComplexity: BackgroundComplexity;
  perspective: string;
  indoorRules: string[];
  outdoorRules: string[];
  depthRules: string[];
  negativeSpaceRules: string[];
}

export interface ColorLanguage {
  primary: string[];
  secondary: string[];
  accent: string[];
  danger: string[];
  success: string[];
  neutral: string[];
  night: string[];
  day: string[];
}

export interface LightingDNA {
  direction: LightDirection;
  intensity: LightIntensity;
  mood: LightMood;
  temperature: string;
  shadowDensity: string;
  highlightRules: string[];
  backlightRules: string[];
  ambient: string;
}

export interface CameraDNA {
  default: DefaultFraming;
  wide: string;
  medium: string;
  closeUp: string;
  extremeCloseUp: string;
  topView: string;
  sideView: string;
  perspectiveRules: string[];
}

export interface CompositionDNA {
  defaultRule: CompositionRule;
  rules: CompositionRule[];
  leadingLines: boolean;
  negativeSpace: string;
  balance: string;
  eyeDirection: string;
  readingFlow: string;
  objectPlacement: string;
}

export interface VisualMetaphor {
  concept: string;
  symbol: string;
  description: string;
  visualStyle: string;
  animationPreference: string;
  cameraPreference: string;
  emotionMapping: Record<string, string>;
  reuseAllowed: boolean;
}

export interface VisualPriorityProfile {
  critical: { newImage: boolean; composition: string; detail: string; minScreenTime: number };
  high: { newImage: boolean; composition: string; detail: string; minScreenTime: number };
  medium: { newImage: boolean; composition: string; detail: string; minScreenTime: number };
  low: { newImage: boolean; composition: string; detail: string; minScreenTime: number };
}

export interface VisualRhythmProfile {
  pattern: DefaultFraming[];
  avoidRepetition: boolean;
  minVariety: number;
}

export interface ImageReuseProfile {
  holdDuringExplanation: boolean;
  slowZoomForReflection: boolean;
  panForContinuation: boolean;
  newOnMeaningChange: boolean;
  maxReuseBeforeNew: number;
}

export interface GrammarRule {
  from: string;
  to: string;
  allowedTransitions: GrammarTransition[];
  preferredTransition: GrammarTransition;
}

export interface VisualGrammar {
  rules: GrammarRule[];
  defaultTransition: GrammarTransition;
  enforceContinuity: boolean;
}

export interface VisualDNAProfile {
  art: ArtStyleDefinition;
  character: CharacterDNA;
  environment: EnvironmentDNA;
  colors: ColorLanguage;
  lighting: LightingDNA;
  camera: CameraDNA;
  composition: CompositionDNA;
  metaphors: VisualMetaphor[];
  priority: VisualPriorityProfile;
  complexity: ImageComplexity;
  rhythm: VisualRhythmProfile;
  reuse: ImageReuseProfile;
  grammar: VisualGrammar;
  metadata: {
    id: string;
    channelDnaId: string;
    name: string;
    version: string;
    createdAt: string;
  };
}

export type SceneLayerType = "background" | "depth" | "main_subject" | "foreground" | "effects" | "subtitles" | "word_highlights" | "debug";

export interface SceneLayer {
  type: SceneLayerType;
  zIndex: number;
  opacity: number;
  blendMode: string;
  content: Record<string, unknown>;
}

export interface SceneComposition {
  sceneIndex: number;
  image: string;
  layers: SceneLayer[];
  camera: CameraTransform;
  lighting: SceneLightingConfig;
  focus: FocusTarget;
  safeArea: SafeAreaBounds;
  cropping: CropRect;
  depthLayers: DepthLayer[];
}

export interface CameraTransform {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  parallaxOffset: number;
}

export interface SceneLightingConfig {
  vignette: number;
  directionalLight: { angle: number; intensity: number };
  glow: number;
  ambientLight: number;
  fog: number;
}

export interface FocusTarget {
  type: "face" | "symbol" | "object" | "background";
  x: number;
  y: number;
  width: number;
  height: number;
  softenBackground: boolean;
}

export interface SafeAreaBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
  subtitleZone: { x: number; y: number; width: number; height: number };
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface DepthLayer {
  index: number;
  label: "foreground" | "character" | "objects" | "environment" | "sky";
  parallaxSpeed: number;
  opacity: number;
  mask: string;
}

export interface RuleOfThirdsResult {
  intersectionPoints: Array<{ x: number; y: number }>;
  subjectOnThird: boolean;
  compositionScore: number;
}

export interface CinematicCompositionScore {
  ruleOfThirds: number;
  visualBalance: number;
  leadingLines: number;
  negativeSpace: number;
  cameraWeight: number;
  motionDirection: number;
  overall: number;
}

export interface AdaptiveRenderProfile {
  channelId: string;
  name: string;
  composition: "calm" | "clear" | "dramatic" | "tight";
  lighting: "soft" | "neutral" | "dramatic";
  subtitleSafeArea: number;
  motionIntensity: number;
  effectsLevel: "minimal" | "moderate" | "strong";
}

export interface StabilizerReport {
  excessiveZoom: boolean;
  abruptFraming: boolean;
  cameraJitter: boolean;
  compositionDrift: boolean;
  unsafeCropping: boolean;
  issues: string[];
}

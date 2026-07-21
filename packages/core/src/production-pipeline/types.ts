export type RenderMode = "draft" | "preview" | "production" | "master_quality" | "archive";

export type ProductionStage =
  | "asset_loader"
  | "scene_builder"
  | "camera_builder"
  | "motion_builder"
  | "effects_builder"
  | "subtitle_builder"
  | "audio_builder"
  | "frame_builder"
  | "encoder";

export type ProductionState =
  | "ready"
  | "building"
  | "rendering"
  | "validating"
  | "encoding"
  | "completed"
  | "archived"
  | "failed";

export interface PipelineInput {
  masterTimeline: unknown;
  approvedImages: string[];
  motionTimeline: unknown;
  voiceTrack: string;
  subtitleTimeline: unknown;
  wordInsertTimeline: unknown;
  channelDNA: Record<string, unknown>;
  renderProfile: RenderProfile;
}

export interface RenderProfile {
  mode: RenderMode;
  fps: number;
  resolution: { width: number; height: number };
  quality: number;
  codec: string;
}

export interface StageContext {
  input: PipelineInput;
  state: Record<string, unknown>;
  errors: string[];
  warnings: string[];
}

export interface RenderScene {
  sceneIndex: number;
  image: string;
  motionPlan: unknown;
  cameraPath: unknown;
  effects: EffectConfig[];
  subtitleEvents: SubtitleEvent[];
  timing: SceneTiming;
}

export interface EffectConfig {
  type: "fade" | "blur" | "glow" | "light_rays" | "depth_blur" | "vignette" | "noise" | "grain" | "color_grade";
  intensity: number;
  duration: number;
}

export interface SubtitleEvent {
  startFrame: number;
  endFrame: number;
  text: string;
  isHighlighted: boolean;
  isKeyword: boolean;
}

export interface SceneTiming {
  startFrame: number;
  endFrame: number;
  holdFrames: number;
  transitionFrames: number;
}

export interface RenderTask {
  taskId: string;
  stage: ProductionStage;
  sceneIndex?: number;
  priority: number;
  gpuRequired: boolean;
  estimateMs: number;
}

export interface EncoderOutput {
  path: string;
  duration: number;
  fps: number;
  resolution: string;
  codec: string;
  sizeBytes: number;
}

export interface ProductionLogEntry {
  timestamp: string;
  stage: ProductionStage;
  status: "started" | "completed" | "warning" | "error";
  message: string;
  durationMs?: number;
  gpuUsage?: number;
}

export interface ValidationResult {
  stage: ProductionStage;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConstructedFrame {
  frameIndex: number;
  sceneIndex: number;
  image: string;
  cameraTransform: Record<string, number>;
  effects: EffectConfig[];
  subtitles: Array<{ text: string; position: { x: number; y: number } }>;
}

export interface RenderBackend {
  name: string;
  render(input: PipelineInput, mode: RenderMode): Promise<EncoderOutput>;
  canHandle(mode: RenderMode): boolean;
  getCapabilities(): string[];
}

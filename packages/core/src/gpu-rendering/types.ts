export type GRRenderBackend = "ffmpeg" | "remotion" | "webgpu" | "opengl" | "vulkan";

export type GRHardwareEncoder = "nvenc" | "qsv" | "amf" | "videotoolbox" | "software";

export type GRGPUVendor = "nvidia" | "amd" | "intel" | "apple" | "unknown";

export type GRRenderStage =
  | "frame_loading" | "texture_upload" | "scene_rendering" | "effect_rendering"
  | "subtitle_rendering" | "frame_encoding" | "video_muxing";

export type GRShaderType = "blur" | "glow" | "depth" | "grain" | "subtitle" | "transition";

export type GRBufferType = "current_frame" | "previous_frame" | "next_frame" | "intermediate" | "render_target";

export type GRRendererTask = "texture_upload" | "shader_execution" | "motion_rendering" | "frame_encoding";

export type GRGPUUsage = "idle" | "loading" | "rendering" | "encoding";

export interface GRHardwareProfile {
  vendor: GRGPUVendor;
  vramMB: number;
  cpuCores: number;
  ramMB: number;
  encoder: GRHardwareEncoder;
  os: string;
  supportsHardwareEncoding: boolean;
}

export interface GRShaderConfig {
  type: GRShaderType;
  source: string;
  reusable: boolean;
}

export interface GRRenderStats {
  totalFrames: number;
  renderedFrames: number;
  failedFrames: number;
  elapsedMs: number;
  estimatedRemainingMs: number;
  avgFrameTimeMs: number;
  gpuUsage: GRGPUUsage;
  vramUsedMB: number;
}

export interface GRCacheEntry {
  key: string;
  size: number;
  lastUsed: number;
  data: unknown;
}

export interface GRScheduledTask {
  id: string;
  type: GRRendererTask;
  frame: number;
  estimatedCost: number;
  priority: number;
}

export interface GRVideoMuxConfig {
  videoCodec: string;
  audioCodec: string;
  container: string;
  includeSubtitles: boolean;
  includeChapters: boolean;
}

export interface GROutputContract {
  backend: string;
  encoder: string;
  fps: number;
  resolution: string;
  renderTime: string;
  status: string;
}

export interface GRValidationResult {
  gpuMemory: boolean;
  frameQueue: boolean;
  subtitleLayers: boolean;
  audioTrack: boolean;
  exportProfile: boolean;
  encoderAvailable: boolean;
  passed: boolean;
}

export interface GRAIOptimizerDecision {
  bottleneckPrediction: string;
  textureOrder: string[];
  cacheSizeAdjustment: number;
  gpuSpikeReduction: number;
  estimatedRemaining: number;
}

export interface GRHardwareBenchmark {
  gpuModel: string;
  driverVersion: string;
  vramBandwidth: number;
  encoderSpeed: number;
  previousRenderTime: number;
  thermalThrottling: boolean;
}

export interface GRDistributedChunk {
  id: string;
  startFrame: number;
  endFrame: number;
  scene: string;
  encoded: boolean;
  outputPath: string;
}

export interface GRZennProfile {
  accelerated: boolean;
  scaling: string;
  subtitleAccuracy: string;
  motionInterpolation: string;
  framePacing: string;
  colorManagement: string;
  textureStreaming: string;
}

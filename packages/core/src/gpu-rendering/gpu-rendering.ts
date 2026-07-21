import type { GRRenderBackend, GRHardwareProfile, GROutputContract, GRValidationResult, GRRenderStats } from "./types.js";
import { GRRenderStages } from "./render-stages.js";
import { GRRenderBackendManager } from "./render-backend.js";
import { GRGPUMemoryManager } from "./gpu-memory-manager.js";
import { GRTextureStreaming } from "./texture-streaming.js";
import { GRTileRendering } from "./tile-rendering.js";
import { GRMultiThreadRenderer } from "./multi-thread-renderer.js";
import { GRHardwareDetection } from "./hardware-detection.js";
import { GRHardwareEncoders } from "./hardware-encoders.js";
import { GRShaderPipeline } from "./shader-pipeline.js";
import { GRFrameBufferManager } from "./frame-buffer-manager.js";
import { GRRenderCache } from "./render-cache.js";
import { GRGPUTaskScheduler } from "./gpu-task-scheduler.js";
import { GRVideoMuxer } from "./video-muxer.js";
import { GRPerformanceOptimizer } from "./performance-optimizer.js";
import { GRZennRenderProfile } from "./zenn-render-profile.js";
import { GRAIRenderOptimizer } from "./ai-render-optimizer.js";
import { GRSmartHardwareProfiler } from "./smart-hardware-profiler.js";
import { GRDistributedRenderPreparation } from "./distributed-render-prep.js";
import { GRGPUValidator } from "./validator.js";
import { GROutputContractBuilder } from "./output-contract.js";

export class GRGPURenderingEngine {
  readonly stages: GRRenderStages;
  readonly backends: GRRenderBackendManager;
  readonly memory: GRGPUMemoryManager;
  readonly textureStreaming: GRTextureStreaming;
  readonly tileRendering: GRTileRendering;
  readonly multiThread: GRMultiThreadRenderer;
  readonly hardwareDetection: GRHardwareDetection;
  readonly encoders: GRHardwareEncoders;
  readonly shaders: GRShaderPipeline;
  readonly frameBuffers: GRFrameBufferManager;
  readonly cache: GRRenderCache;
  readonly taskScheduler: GRGPUTaskScheduler;
  readonly muxer: GRVideoMuxer;
  readonly optimizer: GRPerformanceOptimizer;
  readonly zennProfile: GRZennRenderProfile;
  readonly aiOptimizer: GRAIRenderOptimizer;
  readonly profiler: GRSmartHardwareProfiler;
  readonly distributed: GRDistributedRenderPreparation;
  readonly validator: GRGPUValidator;
  readonly outputContract: GROutputContractBuilder;

  constructor() {
    this.stages = new GRRenderStages();
    this.backends = new GRRenderBackendManager();
    this.memory = new GRGPUMemoryManager();
    this.textureStreaming = new GRTextureStreaming();
    this.tileRendering = new GRTileRendering();
    this.multiThread = new GRMultiThreadRenderer();
    this.hardwareDetection = new GRHardwareDetection();
    this.encoders = new GRHardwareEncoders();
    this.shaders = new GRShaderPipeline();
    this.frameBuffers = new GRFrameBufferManager();
    this.cache = new GRRenderCache();
    this.taskScheduler = new GRGPUTaskScheduler();
    this.muxer = new GRVideoMuxer();
    this.optimizer = new GRPerformanceOptimizer();
    this.zennProfile = new GRZennRenderProfile();
    this.aiOptimizer = new GRAIRenderOptimizer();
    this.profiler = new GRSmartHardwareProfiler();
    this.distributed = new GRDistributedRenderPreparation();
    this.validator = new GRGPUValidator();
    this.outputContract = new GROutputContractBuilder();
  }

  applyZennDefaults(): void {
    const profile = this.zennProfile;
    this.memory.configure(profile.getTextureCacheSize());
    this.cache.configure(profile.getTextureCacheSize());
  }

  detectAndPrepare(): GRHardwareProfile {
    const hwProfile = this.hardwareDetection.detect();
    const backend = this.backends.autoSelect(hwProfile);
    this.backends.select(backend, hwProfile);
    const encoder = this.encoders.selectBest(hwProfile);
    const tune = this.optimizer.optimize(hwProfile);
    this.memory.configure(tune.cacheSizeMB);
    this.cache.configure(tune.cacheSizeMB);
    return hwProfile;
  }

  getStats(rendered: number, total: number, elapsed: number, vramUsed: number): GRRenderStats {
    return {
      totalFrames: total,
      renderedFrames: rendered,
      failedFrames: total - rendered,
      elapsedMs: elapsed,
      estimatedRemainingMs: rendered > 0 ? (elapsed / rendered) * (total - rendered) : total * 50,
      avgFrameTimeMs: rendered > 0 ? elapsed / rendered : 0,
      gpuUsage: this.memory.getUsage(),
      vramUsedMB: vramUsed
    };
  }
}

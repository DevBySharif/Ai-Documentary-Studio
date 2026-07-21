import { PlaybackEngineState, PlaybackStateChangeEvent } from "./playback-state";
import { PreviewQualityProfile, BALANCED_PROFILE, PERFORMANCE_PROFILE, QUALITY_PROFILE } from "./preview-quality";
import { PlaybackDiagnosticsCollector, PlaybackDiagnosticsSnapshot } from "./playback-diagnostics";
import { FrameCache } from "./frame-cache";
import { FrameScheduler } from "./frame-scheduler";
import { AudioSyncManager } from "./audio-sync";
import { GpuResourceManager } from "./gpu-resource-manager";
import { BackgroundPreRenderer } from "./background-prerenderer";
import { TimelineEngine } from "../timeline-engine/timeline-engine";
import { FrameIndex } from "../timeline-engine/time";

type StateChangeCallback = (event: PlaybackStateChangeEvent) => void;

export interface PlaybackOutputContract {
  frame: number;
  fps: number;
  droppedFrames: number;
  previewQuality: string;
  status: string;
}

/**
 * Master Playback Controller — orchestrates frame scheduling, quality adaptation,
 * diagnostics, GPU resource budgeting, background pre-rendering, and A/V sync.
 */
export class PlaybackController {
  private state: PlaybackEngineState = "Stopped";
  private profile: PreviewQualityProfile = BALANCED_PROFILE;

  private readonly cache = new FrameCache();
  private readonly scheduler = new FrameScheduler();
  private readonly syncManager = new AudioSyncManager();
  private readonly diagnostics = new PlaybackDiagnosticsCollector();
  private readonly gpuManager = new GpuResourceManager();
  private readonly preRenderer = new BackgroundPreRenderer();
  private readonly listeners = new Set<StateChangeCallback>();

  constructor(private readonly timelineEngine: TimelineEngine) {
    this.gpuManager.setMemoryBudgetMb(this.profile.maxGpuMemoryMb);
    this.preRenderer.setRenderAheadDistance(this.profile.renderAheadBufferFrames);
  }

  public getState(): PlaybackEngineState {
    return this.state;
  }

  public getDiagnostics(): PlaybackDiagnosticsSnapshot {
    return this.diagnostics.snapshot();
  }

  public getGpuMemoryUsageMb(): number {
    return this.gpuManager.getUsedMemoryMb();
  }

  /**
   * Output Contract (IB Part 15 - Section 19)
   */
  public getOutputContract(): PlaybackOutputContract {
    const diag = this.diagnostics.snapshot();
    const timeline = this.timelineEngine.getTimeline();
    return {
      frame: timeline.playhead.currentFrame,
      fps: diag.targetFps,
      droppedFrames: diag.droppedFrames,
      previewQuality: this.profile.name,
      status: this.state,
    };
  }

  public setQualityProfile(profile: PreviewQualityProfile): void {
    this.profile = profile;
    this.gpuManager.setMemoryBudgetMb(profile.maxGpuMemoryMb);
    this.preRenderer.setRenderAheadDistance(profile.renderAheadBufferFrames);

    const timeline = this.timelineEngine.getTimeline();
    this.diagnostics.setTargets(
      timeline.timebase.numerator / timeline.timebase.denominator,
      profile.name
    );
  }

  public play(): void {
    if (this.state === "Playing") return;

    this.preRenderer.setIdleState(false);
    const timeline = this.timelineEngine.getTimeline();
    const startFrame = timeline.playhead.currentFrame;
    const maxFrame = timeline.durationFrames;

    this.transitionState("Playing", startFrame);

    this.scheduler.start(
      startFrame,
      maxFrame,
      timeline.timebase,
      (frame: FrameIndex) => this.onFrameTick(frame)
    );
  }

  public pause(): void {
    if (this.state === "Paused" || this.state === "Stopped") return;

    this.scheduler.stop();
    const currentFrame = this.timelineEngine.getTimeline().playhead.currentFrame;
    this.transitionState("Paused", currentFrame);
    this.preRenderer.setIdleState(true);
  }

  public seek(frame: FrameIndex): void {
    const prevState = this.state;
    this.preRenderer.cancelPending();

    this.transitionState("Seeking", frame);
    this.timelineEngine.execute({ type: "Seek", frame });

    // Warm cache or present frame
    this.cache.get(frame);

    if (prevState === "Playing") {
      this.play();
    } else {
      this.transitionState("Paused", frame);
    }
  }

  public scrub(frame: FrameIndex): void {
    this.preRenderer.cancelPending();
    this.transitionState("Scrubbing", frame);
    this.timelineEngine.execute({ type: "Seek", frame });
  }

  public subscribeStateChange(callback: StateChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private onFrameTick(frame: FrameIndex): void {
    const start = Date.now();
    this.timelineEngine.execute({ type: "Seek", frame });

    const cached = this.cache.get(frame);
    this.diagnostics.recordCacheHit(cached !== undefined);

    const renderTime = Date.now() - start;

    // Detect frame drop & apply adaptive quality degradation if necessary (Section 24)
    const targetIntervalMs = 1000 / (this.timelineEngine.getTimeline().timebase.numerator / this.timelineEngine.getTimeline().timebase.denominator);
    if (renderTime > targetIntervalMs) {
      this.diagnostics.recordDroppedFrame();
      this.adaptQualityOnLoad();
    }

    this.diagnostics.recordFramePresented(1, renderTime);
  }

  /**
   * Adaptive Playback Quality (IB Part 15 - Section 24)
   * Automatically degrades preview quality under high workload to maintain continuous playback.
   */
  private adaptQualityOnLoad(): void {
    if (this.profile.name === "Quality") {
      console.warn("[PlaybackController] Dropped frame detected. Dynamically adapting quality to 'Balanced'.");
      this.setQualityProfile(BALANCED_PROFILE);
    } else if (this.profile.name === "Balanced") {
      console.warn("[PlaybackController] Dropped frame detected. Dynamically adapting quality to 'Performance'.");
      this.setQualityProfile(PERFORMANCE_PROFILE);
    }
  }

  private transitionState(newState: PlaybackEngineState, frame: number): void {
    const event: PlaybackStateChangeEvent = {
      previousState: this.state,
      currentState: newState,
      frame,
      timestamp: new Date(),
    };
    this.state = newState;
    this.listeners.forEach((cb) => cb(event));
  }
}

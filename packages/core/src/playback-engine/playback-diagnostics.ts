import { ProfileName } from "./preview-quality";

export interface PlaybackDiagnosticsSnapshot {
  readonly currentFps: number;
  readonly targetFps: number;
  readonly droppedFrames: number;
  readonly totalFramesPresented: number;
  readonly decodeTimeMs: number;
  readonly gpuRenderTimeMs: number;
  readonly cacheHitRatio: number;
  readonly audioDriftMs: number;
  readonly previewProfile: ProfileName;
}

export class PlaybackDiagnosticsCollector {
  private targetFps = 25;
  private currentFps = 25;
  private droppedFrames = 0;
  private totalPresented = 0;
  private decodeTimeMs = 0;
  private gpuRenderTimeMs = 0;
  private cacheHits = 0;
  private cacheMisses = 0;
  private audioDriftMs = 0;
  private profileName: ProfileName = "Balanced";

  public recordFramePresented(decodeTimeMs: number, gpuRenderTimeMs: number): void {
    this.totalPresented++;
    this.decodeTimeMs = decodeTimeMs;
    this.gpuRenderTimeMs = gpuRenderTimeMs;
  }

  public recordDroppedFrame(): void {
    this.droppedFrames++;
  }

  public recordCacheHit(hit: boolean): void {
    if (hit) this.cacheHits++;
    else this.cacheMisses++;
  }

  public recordAudioDrift(driftMs: number): void {
    this.audioDriftMs = driftMs;
  }

  public setTargets(fps: number, profileName: ProfileName): void {
    this.targetFps = fps;
    this.profileName = profileName;
  }

  public snapshot(): PlaybackDiagnosticsSnapshot {
    const totalCache = this.cacheHits + this.cacheMisses;
    const ratio = totalCache > 0 ? this.cacheHits / totalCache : 1.0;

    return {
      currentFps: this.currentFps,
      targetFps: this.targetFps,
      droppedFrames: this.droppedFrames,
      totalFramesPresented: this.totalPresented,
      decodeTimeMs: this.decodeTimeMs,
      gpuRenderTimeMs: this.gpuRenderTimeMs,
      cacheHitRatio: Math.round(ratio * 100) / 100,
      audioDriftMs: this.audioDriftMs,
      previewProfile: this.profileName,
    };
  }
}

import { FrameIndex, Timebase, framesToSeconds } from "../timeline-engine/time";

/**
 * Manages A/V sync drift calculation between Audio Master Clock and Video Frame Clock.
 */
export class AudioSyncManager {
  private masterAudioTimeSeconds = 0;
  private readonly maxAllowedDriftMs = 40; // ~1 frame at 25fps

  public updateMasterAudioClock(seconds: number): void {
    this.masterAudioTimeSeconds = seconds;
  }

  public calculateDriftMs(currentVideoFrame: FrameIndex, timebase: Timebase): number {
    const videoTimeSeconds = framesToSeconds(currentVideoFrame, timebase);
    const driftSeconds = videoTimeSeconds - this.masterAudioTimeSeconds;
    return Math.round(driftSeconds * 1000);
  }

  public isSyncAcceptable(driftMs: number): boolean {
    return Math.abs(driftMs) <= this.maxAllowedDriftMs;
  }
}

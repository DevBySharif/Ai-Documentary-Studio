import { FrameIndex, Timebase, framesPerSecond } from "../timeline-engine/time";

export type FrameCallback = (frame: FrameIndex) => void;

/**
 * Frame Scheduler managing precise timing and tick scheduling for playback.
 */
export class FrameScheduler {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentFrame: FrameIndex = 0;
  private maxFrame: FrameIndex = 0;
  private fps = 25;

  public start(
    startFrame: FrameIndex,
    maxFrame: FrameIndex,
    timebase: Timebase,
    onTick: FrameCallback
  ): void {
    this.stop();
    this.currentFrame = startFrame;
    this.maxFrame = maxFrame;
    this.fps = framesPerSecond(timebase);

    const intervalMs = 1000 / this.fps;

    this.intervalId = setInterval(() => {
      if (this.currentFrame >= this.maxFrame) {
        this.stop();
        return;
      }
      this.currentFrame++;
      onTick(this.currentFrame);
    }, intervalMs);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public isRunning(): boolean {
    return this.intervalId !== null;
  }
}

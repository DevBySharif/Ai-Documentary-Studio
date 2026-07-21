import type { FMFrameState, FSFrameCacheData } from "./types.js";

export class FSFrameCache {
  private previousFrames: Map<number, FMFrameState> = new Map();
  private currentBatch: FMFrameState[] = [];
  private maxPrevious = 60;

  configure(maxPrevious: number): void {
    this.maxPrevious = maxPrevious;
  }

  storePrevious(frame: FMFrameState): void {
    this.previousFrames.set(frame.frameNumber, frame);
    if (this.previousFrames.size > this.maxPrevious) {
      const oldest = Math.min(...this.previousFrames.keys());
      this.previousFrames.delete(oldest);
    }
  }

  getPrevious(frameNumber: number): FMFrameState | undefined {
    return this.previousFrames.get(frameNumber);
  }

  setCurrentBatch(batch: FMFrameState[]): void {
    this.currentBatch = [...batch];
  }

  getCurrentBatch(): FMFrameState[] {
    return [...this.currentBatch];
  }

  getUpcomingFrameCount(): number {
    return this.maxPrevious;
  }

  getState(): FSFrameCacheData {
    return {
      previousFrames: new Map(this.previousFrames),
      currentBatch: [...this.currentBatch],
      upcomingFrameCount: this.maxPrevious
    };
  }

  clear(): void {
    this.previousFrames.clear();
    this.currentBatch = [];
  }

  size(): number {
    return this.previousFrames.size + this.currentBatch.length;
  }
}

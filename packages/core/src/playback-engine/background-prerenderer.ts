import { FrameIndex } from "../timeline-engine/time";
import { FrameCache, CachedFrame } from "./frame-cache";

/**
 * Background Pre-Rendering & Render-Ahead Buffer Engine (IB Part 15 - Sections 16 & 20).
 * Pre-renders upcoming frames when idle or playing to warm cache and ensure low-latency playback.
 */
export class BackgroundPreRenderer {
  private isIdle = true;
  private renderAheadCount = 15;
  private abortController: AbortController | null = null;

  public setRenderAheadDistance(framesCount: number): void {
    this.renderAheadCount = framesCount;
  }

  public setIdleState(idle: boolean): void {
    this.isIdle = idle;
    if (!idle) {
      this.cancelPending();
    }
  }

  public cancelPending(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  public async preRenderUpcomingFrames(
    currentFrame: FrameIndex,
    maxFrame: FrameIndex,
    cache: FrameCache,
    renderFrameFn: (frame: FrameIndex) => Promise<CachedFrame>
  ): Promise<void> {
    this.cancelPending();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const endFrame = Math.min(maxFrame, currentFrame + this.renderAheadCount);

    for (let frame = currentFrame + 1; frame <= endFrame; frame++) {
      if (signal.aborted) break;

      // Skip if already in cache
      if (cache.get(frame)) continue;

      try {
        const cached = await renderFrameFn(frame);
        if (!signal.aborted) {
          cache.put(cached);
        }
      } catch (err) {
        // Degrade gracefully on single frame failure
        console.warn(`[BackgroundPreRenderer] Failed to pre-render frame ${frame}`, err);
      }
    }
  }
}

export type RenderPassType =
  | "Geometry"
  | "Effects"
  | "Compositing"
  | "Color"
  | "Titles"
  | "Subtitles"
  | "FinalComposite";

export interface RenderPassPlan {
  readonly passType: RenderPassType;
  readonly executionOrder: number;
  readonly isFullPrecision: boolean;
}

/**
 * Multi-Pass Render Planner (IB Part 21 - Section 6, Section 7, Section 20).
 * Reuses the full-quality Render Graph model without adaptive quality reduction.
 */
export class RenderPlanner {
  public planPasses(): ReadonlyArray<RenderPassPlan> {
    return [
      { passType: "Geometry", executionOrder: 1, isFullPrecision: true },
      { passType: "Effects", executionOrder: 2, isFullPrecision: true },
      { passType: "Compositing", executionOrder: 3, isFullPrecision: true },
      { passType: "Color", executionOrder: 4, isFullPrecision: true },
      { passType: "Titles", executionOrder: 5, isFullPrecision: true },
      { passType: "Subtitles", executionOrder: 6, isFullPrecision: true },
      { passType: "FinalComposite", executionOrder: 7, isFullPrecision: true },
    ];
  }

  public estimateRenderDurationSeconds(totalFrames: number, targetFps: number): number {
    const processingRatio = 1.2; // 1.2x real-time estimate for full quality
    return Math.round((totalFrames / targetFps) * processingRatio);
  }
}

import type { GRRenderStage } from "./types.js";

export class GRRenderStages {
  private readonly stages: GRRenderStage[] = [
    "frame_loading", "texture_upload", "scene_rendering",
    "effect_rendering", "subtitle_rendering", "frame_encoding", "video_muxing"
  ];

  private currentIndex = -1;

  getStages(): GRRenderStage[] {
    return [...this.stages];
  }

  getCurrentStage(): GRRenderStage | null {
    return this.currentIndex >= 0 && this.currentIndex < this.stages.length ? this.stages[this.currentIndex] : null;
  }

  advance(): GRRenderStage | null {
    if (this.currentIndex < this.stages.length - 1) {
      this.currentIndex++;
      return this.stages[this.currentIndex];
    }
    return null;
  }

  reset(): void {
    this.currentIndex = -1;
  }

  isComplete(): boolean {
    return this.currentIndex >= this.stages.length - 1;
  }

  getStageIndex(stage: GRRenderStage): number {
    return this.stages.indexOf(stage);
  }

  getProgress(): number {
    if (this.stages.length === 0) return 0;
    return (this.currentIndex + 1) / this.stages.length;
  }
}

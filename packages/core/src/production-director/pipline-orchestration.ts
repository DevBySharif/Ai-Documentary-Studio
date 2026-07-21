import type { PDEngineType, PDProductionState, PDProjectStage } from "./types.js";

export class PDPipelineOrchestration {
  private readonly pipeline: PDEngineType[] = [
    "script", "prompt", "image_approval", "voice", "timeline",
    "motion", "subtitle", "effects", "qa", "export"
  ];

  private currentIndex = -1;

  getPipeline(): PDEngineType[] {
    return [...this.pipeline];
  }

  getCurrentEngine(): PDEngineType | null {
    return this.currentIndex >= 0 && this.currentIndex < this.pipeline.length ? this.pipeline[this.currentIndex] : null;
  }

  advance(): PDEngineType | null {
    if (this.currentIndex < this.pipeline.length - 1) {
      this.currentIndex++;
      return this.pipeline[this.currentIndex];
    }
    return null;
  }

  getStage(engine: PDEngineType): PDProjectStage {
    const map: Record<PDEngineType, PDProjectStage> = {
      script: "planning", prompt: "generating", image_approval: "generating",
      voice: "generating", timeline: "generating", motion: "rendering",
      subtitle: "rendering", effects: "rendering", qa: "qa", export: "export"
    };
    return map[engine];
  }

  getState(): PDProductionState {
    const completed = this.pipeline.slice(0, Math.max(0, this.currentIndex));
    return {
      stage: this.currentIndex < 0 ? "planning" : this.getStage(this.pipeline[this.currentIndex]),
      completedStages: completed,
      currentEngine: this.getCurrentEngine(),
      approvedScenes: 0,
      totalScenes: 0,
      progress: this.pipeline.length > 0 ? (this.currentIndex + 1) / this.pipeline.length : 0
    };
  }

  reset(): void {
    this.currentIndex = -1;
  }

  isComplete(): boolean {
    return this.currentIndex >= this.pipeline.length - 1;
  }
}

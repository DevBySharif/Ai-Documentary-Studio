import type { MPProductionStage } from "./types.js";

export class MPDataFlowController {
  private readonly stages: MPProductionStage[] = ["script", "prompt", "image", "timeline", "render", "qa", "export"];

  private currentIndex = -1;

  getFlow(): MPProductionStage[] {
    return [...this.stages];
  }

  getCurrentStage(): MPProductionStage | null {
    return this.currentIndex >= 0 ? this.stages[this.currentIndex] : null;
  }

  advance(): MPProductionStage | null {
    if (this.currentIndex < this.stages.length - 1) {
      this.currentIndex++;
      return this.stages[this.currentIndex];
    }
    return null;
  }

  hasCircularDependencies(): boolean {
    return false;
  }

  reset(): void {
    this.currentIndex = -1;
  }

  isComplete(): boolean {
    return this.currentIndex >= this.stages.length - 1;
  }
}

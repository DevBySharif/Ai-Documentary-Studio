import type { PDProjectStage, PDProductionState, PDEngineType } from "./types.js";

export class PDProjectStateMachine {
  private current: PDProjectStage = "planning";

  private readonly transitions: Record<PDProjectStage, PDProjectStage[]> = {
    planning: ["generating"],
    generating: ["review"],
    review: ["rendering", "planning"],
    rendering: ["qa"],
    qa: ["export", "rendering"],
    export: ["published"],
    published: []
  };

  transitionTo(stage: PDProjectStage): boolean {
    if (!this.canTransitionTo(stage)) return false;
    this.current = stage;
    return true;
  }

  canTransitionTo(stage: PDProjectStage): boolean {
    return this.transitions[this.current]?.includes(stage) ?? false;
  }

  getCurrentStage(): PDProjectStage {
    return this.current;
  }

  getState(): PDProductionState {
    return { stage: this.current, completedStages: [], currentEngine: null, approvedScenes: 0, totalScenes: 0, progress: 0 };
  }

  reset(): void {
    this.current = "planning";
  }

  isComplete(): boolean {
    return this.current === "published";
  }
}

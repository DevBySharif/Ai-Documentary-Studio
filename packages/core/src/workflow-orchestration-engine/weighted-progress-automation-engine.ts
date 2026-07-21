import { ProjectLifecycleStage } from "./workflow-types";

/**
 * Weighted Progress Calculator & Configurable Automation Rules Engine (Vol 06 Part 05 - Section 15, Section 16, Section 19).
 * Calculates 100% weighted project progress and triggers configurable stage auto-advancement.
 */
export class WeightedProgressAutomationEngine {
  private stageWeights: Record<ProjectLifecycleStage, number> = {
    Created: 0,
    Research: 10,
    Script: 15,
    Storyboard: 15,
    PromptPreparation: 10,
    ImageProduction: 20,
    VoiceProduction: 10,
    TimelineEditing: 10,
    Review: 5,
    Export: 5,
    Archived: 0,
  };

  private isAutoAdvancementEnabled = true;

  public calculateOverallProgress(completedStages: ReadonlyArray<ProjectLifecycleStage>): number {
    let total = 0;
    completedStages.forEach((st) => {
      total += this.stageWeights[st] || 0;
    });
    return Math.min(100, total);
  }

  public shouldAutoAdvance(currentStage: ProjectLifecycleStage): boolean {
    return this.isAutoAdvancementEnabled;
  }

  public setAutoAdvancement(enabled: boolean): void {
    this.isAutoAdvancementEnabled = enabled;
  }
}

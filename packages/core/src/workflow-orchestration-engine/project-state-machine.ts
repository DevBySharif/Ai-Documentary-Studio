import { ProjectLifecycleStage, ActiveProjectState } from "./workflow-types";

/**
 * Project State Machine & Validation Engine (Vol 06 Part 05 - Section 4, Section 5).
 * Validates stage progression and blocks invalid state machine transitions.
 */
export class ProjectStateMachine {
  private currentStage: ProjectLifecycleStage = "Created";
  private currentState: ActiveProjectState = "Created";

  private stageOrder: ProjectLifecycleStage[] = [
    "Created",
    "Research",
    "Script",
    "Storyboard",
    "PromptPreparation",
    "ImageProduction",
    "VoiceProduction",
    "TimelineEditing",
    "Review",
    "Export",
    "Archived",
  ];

  public transitionStage(targetStage: ProjectLifecycleStage): { isSuccess: boolean; reason: string } {
    const currentIdx = this.stageOrder.indexOf(this.currentStage);
    const targetIdx = this.stageOrder.indexOf(targetStage);

    // Can progress sequentially or stay on current
    if (targetIdx <= currentIdx + 1) {
      this.currentStage = targetStage;
      this.currentState = "Active";
      return { isSuccess: true, reason: `Successfully transitioned to ${targetStage}` };
    }

    return {
      isSuccess: false,
      reason: `Invalid Transition: Cannot skip from ${this.currentStage} directly to ${targetStage}. Required preceding stages incomplete.`,
    };
  }

  public getCurrentStage(): ProjectLifecycleStage {
    return this.currentStage;
  }

  public getCurrentState(): ActiveProjectState {
    return this.currentState;
  }
}

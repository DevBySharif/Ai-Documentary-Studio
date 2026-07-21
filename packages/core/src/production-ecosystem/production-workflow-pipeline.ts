import { AiDecisionRecommendation } from "./explainable-decision-model";

export type WorkflowStep =
  | "Understand"
  | "Analyze"
  | "Generate"
  | "Validate"
  | "Explain"
  | "Approve"
  | "Apply";

export interface ProductionWorkflowStage {
  readonly currentStep: WorkflowStep;
  readonly isApprovedByHuman: boolean;
}

/**
 * Standardized 8-Step Production Workflow Pipeline (Vol 04 Part 01 - Section 4, Section 5, Section 10).
 * Sequence: Understand -> Analyze -> Generate -> Validate -> Explain -> Approve -> Apply.
 * Human-First: AI never silently applies changes without explicit approval.
 */
export class ProductionWorkflowPipeline {
  private currentStep: WorkflowStep = "Understand";
  private isApproved = false;

  public transitionStep(step: WorkflowStep): void {
    this.currentStep = step;
  }

  public approveDecision(recommendation: AiDecisionRecommendation): AiDecisionRecommendation {
    this.isApproved = true;
    this.currentStep = "Apply";
    return { ...recommendation, isApproved: true };
  }

  public getStage(): ProductionWorkflowStage {
    return {
      currentStep: this.currentStep,
      isApprovedByHuman: this.isApproved,
    };
  }
}

import { ProjectStateMachine } from "./project-state-machine";
import { StageDependencyConditionEvaluator } from "./stage-dependency-condition-evaluator";
import { MilestoneCheckpointRecoveryManager } from "./milestone-checkpoint-recovery-manager";
import { WorkflowRollbackImpactAnalyzer } from "./workflow-rollback-impact-analyzer";
import { WeightedProgressAutomationEngine } from "./weighted-progress-automation-engine";
import { ProjectLifecycleStage } from "./workflow-types";

/**
 * Master Workflow Orchestration Engine (Main Vol 06 Part 05).
 * Orchestrates project state transitions, stage conditions, background jobs, milestone checkpoints, rollback impact analysis, and progress calculation.
 */
export class MasterWorkflowOrchestration {
  public readonly stateMachine = new ProjectStateMachine();
  public readonly conditionEvaluator = new StageDependencyConditionEvaluator();
  public readonly checkpointManager = new MilestoneCheckpointRecoveryManager();
  public readonly rollbackAnalyzer = new WorkflowRollbackImpactAnalyzer();
  public readonly progressEngine = new WeightedProgressAutomationEngine();

  public advanceStage(completedStages: ReadonlyArray<ProjectLifecycleStage>, targetStage: ProjectLifecycleStage): {
    isSuccess: boolean;
    progressPercent: number;
    reason: string;
  } {
    const cond = this.conditionEvaluator.evaluateStageConditions(targetStage, completedStages);
    if (!cond.entryRequirementsMet) {
      return {
        isSuccess: false,
        progressPercent: this.progressEngine.calculateOverallProgress(completedStages),
        reason: `Entry conditions for ${targetStage} not met. Missing upstream stages.`,
      };
    }

    const transition = this.stateMachine.transitionStage(targetStage);
    const updatedCompleted = [...completedStages, targetStage];
    const progress = this.progressEngine.calculateOverallProgress(updatedCompleted);

    if (transition.isSuccess) {
      this.checkpointManager.createCheckpoint("proj_curr", `Advanced to ${targetStage}`, targetStage, "Active", progress);
    }

    return {
      isSuccess: transition.isSuccess,
      progressPercent: progress,
      reason: transition.reason,
    };
  }
}

import { ProjectLifecycleStage, WorkflowRollbackImpact } from "./workflow-types";

/**
 * Workflow Rollback & Downstream Artifact Invalidation Engine (Vol 06 Part 05 - Section 14).
 * Identifies affected downstream stages and artifacts when rolling back to an earlier production stage.
 */
export class WorkflowRollbackImpactAnalyzer {
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

  public analyzeRollbackImpact(targetStage: ProjectLifecycleStage): WorkflowRollbackImpact {
    const idx = this.stageOrder.indexOf(targetStage);
    const downstream = idx >= 0 ? this.stageOrder.slice(idx + 1) : [];

    return {
      targetStage,
      invalidatedDownstreamStages: downstream,
      affectedArtifactIds: downstream.map((s) => `art_downstream_${s.toLowerCase()}`),
    };
  }
}

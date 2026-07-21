import { WorkflowCheckpoint, ProjectLifecycleStage, ActiveProjectState } from "./workflow-types";

/**
 * Milestone Checkpoint & Interruption Recovery System (Vol 06 Part 05 - Section 12, Section 13).
 * Captures milestone checkpoints and restores workflow state after unexpected application interruptions.
 */
export class MilestoneCheckpointRecoveryManager {
  private checkpoints: WorkflowCheckpoint[] = [];

  public createCheckpoint(
    projectId: string,
    milestoneName: string,
    stage: ProjectLifecycleStage,
    state: ActiveProjectState,
    progressPercent: number
  ): WorkflowCheckpoint {
    const cp: WorkflowCheckpoint = {
      checkpointId: `chk_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      milestoneName,
      stage,
      state,
      overallProgressPercent: progressPercent,
      createdAt: new Date(),
    };
    this.checkpoints.push(cp);
    return cp;
  }

  public restoreLatestCheckpoint(projectId: string): WorkflowCheckpoint | undefined {
    const projectCheckpoints = this.checkpoints.filter((c) => c.projectId === projectId);
    return projectCheckpoints[projectCheckpoints.length - 1];
  }
}

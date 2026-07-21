import { RuntimeCheckpoint } from "./supervisor-types";

/**
 * Partial Success & Runtime Checkpoint Manager (Vol 07 Part 04 - Section 11, Section 12).
 * Handles partial success (e.g., 48/50 images succeeded -> retries only 2 failed) and saves runtime checkpoints for recovery.
 */
export class PartialSuccessCheckpointManager {
  private checkpoints: RuntimeCheckpoint[] = [];

  public createRuntimeCheckpoint(planId: string, completed: string[], active: string[], pending: string[]): RuntimeCheckpoint {
    const cp: RuntimeCheckpoint = {
      checkpointId: `chk_rt_${Math.random().toString(36).substring(2, 7)}`,
      planId,
      completedTaskIds: completed,
      activeTaskIds: active,
      pendingTaskIds: pending,
      timestamp: new Date(),
    };
    this.checkpoints.push(cp);
    return cp;
  }

  public isolateFailedSubtasks(totalSubtasksCount: number, failedIndices: number[]): { successfulCount: number; retryIndices: number[] } {
    return {
      successfulCount: totalSubtasksCount - failedIndices.length,
      retryIndices: failedIndices,
    };
  }
}

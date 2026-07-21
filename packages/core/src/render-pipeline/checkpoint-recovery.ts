export interface RenderCheckpoint {
  readonly jobId: string;
  readonly lastRenderedFrame: number;
  readonly checkpointFilePath: string;
  readonly savedAt: Date;
}

/**
 * Checkpointed Rendering & Crash Recovery (IB Part 21 - Section 16, Section 21).
 * Reuses completed render segments upon resumption.
 */
export class CheckpointRecoveryEngine {
  private checkpoints = new Map<string, RenderCheckpoint>();

  public saveCheckpoint(jobId: string, lastRenderedFrame: number, checkpointFilePath: string): RenderCheckpoint {
    const checkpoint: RenderCheckpoint = {
      jobId,
      lastRenderedFrame,
      checkpointFilePath,
      savedAt: new Date(),
    };
    this.checkpoints.set(jobId, checkpoint);
    return checkpoint;
  }

  public getCheckpoint(jobId: string): RenderCheckpoint | undefined {
    return this.checkpoints.get(jobId);
  }

  public clearCheckpoint(jobId: string): void {
    this.checkpoints.delete(jobId);
  }
}

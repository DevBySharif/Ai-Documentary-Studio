import type { ProductionStage, RenderScene } from "./types.js";

export interface RecoveryCheckpoint {
  stage: ProductionStage;
  sceneIndex: number;
  timestamp: string;
  state: Record<string, unknown>;
}

export class FailureRecovery {
  private checkpoints: RecoveryCheckpoint[] = [];

  checkpoint(stage: ProductionStage, sceneIndex: number, state: Record<string, unknown>): void {
    this.checkpoints.push({ stage, sceneIndex, timestamp: new Date().toISOString(), state });
  }

  getLastCheckpoint(): RecoveryCheckpoint | null {
    return this.checkpoints.length > 0 ? this.checkpoints[this.checkpoints.length - 1] : null;
  }

  getResumePoint(): { stage: ProductionStage; sceneIndex: number; state: Record<string, unknown> } | null {
    const last = this.getLastCheckpoint();
    if (!last) return null;
    return { stage: last.stage, sceneIndex: last.sceneIndex, state: last.state };
  }

  canResume(): boolean {
    return this.checkpoints.length > 0;
  }

  clear(): void {
    this.checkpoints = [];
  }

  getCheckpointCount(): number {
    return this.checkpoints.length;
  }
}

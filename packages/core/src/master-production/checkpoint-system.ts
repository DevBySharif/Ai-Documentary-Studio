import type { MPCheckpoint, MPCheckpointStage } from "./types.js";

export class MPCheckpointSystem {
  private checkpoints: MPCheckpoint[] = [];

  store(stage: MPCheckpointStage, projectVersion: string, data: Record<string, unknown>): MPCheckpoint {
    const cp: MPCheckpoint = { stage, timestamp: Date.now(), projectVersion, data };
    this.checkpoints.push(cp);
    return cp;
  }

  getLatest(): MPCheckpoint | null {
    if (this.checkpoints.length === 0) return null;
    return { ...this.checkpoints[this.checkpoints.length - 1] };
  }

  getByStage(stage: MPCheckpointStage): MPCheckpoint | undefined {
    const cp = this.checkpoints.find((c) => c.stage === stage);
    return cp ? { ...cp } : undefined;
  }

  resumeFrom(stage: MPCheckpointStage): MPCheckpoint | null {
    const cp = this.getByStage(stage);
    if (!cp) return null;
    const idx = this.checkpoints.findIndex((c) => c.stage === stage);
    this.checkpoints = this.checkpoints.slice(0, idx + 1);
    return cp;
  }

  getCheckpointCount(): number {
    return this.checkpoints.length;
  }

  clear(): void {
    this.checkpoints = [];
  }
}

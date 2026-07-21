import type { FSCheckpoint, FSRecoveryState, FSCameraState, FSSubtitleState, FSEffectState } from "./types.js";

export class FFFrameRecoveryEngine {
  private checkpoints: FSCheckpoint[] = [];
  private state: FSRecoveryState = "idle";

  storeCheckpoint(frame: number, scene: string, camera: FSCameraState, subtitle: FSSubtitleState, effect: FSEffectState, audioPosition: number): FSCheckpoint {
    const cp: FSCheckpoint = { frame, scene, camera, subtitle, effect, audioPosition, timestamp: Date.now() };
    this.checkpoints.push(cp);
    this.checkpoints.sort((a, b) => a.frame - b.frame);
    this.state = "storing";
    return cp;
  }

  getLastCheckpoint(): FSCheckpoint | null {
    if (this.checkpoints.length === 0) return null;
    return { ...this.checkpoints[this.checkpoints.length - 1] };
  }

  getNearestCheckpoint(frame: number): FSCheckpoint | null {
    if (this.checkpoints.length === 0) return null;
    let nearest = this.checkpoints[0];
    let minDist = Math.abs(frame - nearest.frame);
    for (const cp of this.checkpoints) {
      const dist = Math.abs(frame - cp.frame);
      if (dist < minDist) { nearest = cp; minDist = dist; }
    }
    return { ...nearest };
  }

  recover(targetFrame: number): FSCheckpoint | null {
    const cp = this.getNearestCheckpoint(targetFrame);
    if (!cp) return null;
    this.state = "recovering";
    return cp;
  }

  completeRecovery(): void {
    this.state = "completed";
  }

  getState(): FSRecoveryState {
    return this.state;
  }

  clearCheckpoints(): void {
    this.checkpoints = [];
    this.state = "idle";
  }

  getCheckpointCount(): number {
    return this.checkpoints.length;
  }
}

import type { MRPhysicsConfig } from "./types.js";

export class MRMotionPhysics {
  private config: MRPhysicsConfig = { cameraWeight: 0.5, microDrift: 0.02, stabilization: 0.1, humanImperfection: 0.01 };

  configure(config: Partial<MRPhysicsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  applyWeight(value: number): number {
    return value * (1 / this.config.cameraWeight);
  }

  applyMicroDrift(frame: number): { x: number; y: number } {
    const driftX = Math.sin(frame * 0.1) * this.config.microDrift;
    const driftY = Math.cos(frame * 0.13) * this.config.microDrift;
    return { x: driftX, y: driftY };
  }

  stabilize(rawX: number, rawY: number, prevStableX: number, prevStableY: number): { x: number; y: number } {
    return {
      x: prevStableX + (rawX - prevStableX) * (1 - this.config.stabilization),
      y: prevStableY + (rawY - prevStableY) * (1 - this.config.stabilization)
    };
  }

  addImperfection(frame: number): number {
    return Math.sin(frame * 0.07) * this.config.humanImperfection;
  }
}

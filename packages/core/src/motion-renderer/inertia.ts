import type { MRCameraInertia } from "./types.js";

export class MRCameraInertiaEngine {
  private velocityX = 0;
  private velocityY = 0;
  private velocityZoom = 0;

  private config: MRCameraInertia = { acceleration: 0.05, deceleration: 0.08, momentum: 0.9, weight: 1.0 };

  configure(config: Partial<MRCameraInertia>): void {
    this.config = { ...this.config, ...config };
  }

  update(targetX: number, targetY: number, targetZoom: number, currentX: number, currentY: number, currentZoom: number): { x: number; y: number; zoom: number } {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const dz = targetZoom - currentZoom;

    const accelX = dx * this.config.acceleration / this.config.weight;
    const accelY = dy * this.config.acceleration / this.config.weight;
    const accelZ = dz * this.config.acceleration / this.config.weight;

    this.velocityX = (this.velocityX + accelX) * this.config.momentum;
    this.velocityY = (this.velocityY + accelY) * this.config.momentum;
    this.velocityZoom = (this.velocityZoom + accelZ) * this.config.momentum;

    if (Math.abs(dx) < 0.5) this.velocityX *= (1 - this.config.deceleration);
    if (Math.abs(dy) < 0.5) this.velocityY *= (1 - this.config.deceleration);
    if (Math.abs(dz) < 0.01) this.velocityZoom *= (1 - this.config.deceleration);

    return {
      x: currentX + this.velocityX,
      y: currentY + this.velocityY,
      zoom: currentZoom + this.velocityZoom
    };
  }

  reset(): void {
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityZoom = 0;
  }
}

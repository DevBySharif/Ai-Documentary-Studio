import type { SceneLightingConfig } from "./types.js";

export class SceneLightingEngine {
  private config: SceneLightingConfig = {
    vignette: 0.3, directionalLight: { angle: 45, intensity: 0.2 }, glow: 0.05, ambientLight: 0.8, fog: 0
  };

  configure(config: Partial<SceneLightingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): SceneLightingConfig {
    return { ...this.config };
  }

  applyVignette(pixel: { r: number; g: number; b: number }, x: number, y: number, width: number, height: number): { r: number; g: number; b: number } {
    const nx = (x / width) * 2 - 1;
    const ny = (y / height) * 2 - 1;
    const dist = Math.sqrt(nx * nx + ny * ny);
    const factor = 1 - this.config.vignette * Math.min(1, Math.max(0, dist - 0.5));
    return { r: pixel.r * factor, g: pixel.g * factor, b: pixel.b * factor };
  }

  applyDirectionalLight(pixel: { r: number; g: number; b: number }, surfaceNormal: { x: number; y: number; z: number }): { r: number; g: number; b: number } {
    const rad = (this.config.directionalLight.angle * Math.PI) / 180;
    const lightDir = { x: Math.cos(rad), y: 0, z: Math.sin(rad) };
    const dot = surfaceNormal.x * lightDir.x + surfaceNormal.y * lightDir.y + surfaceNormal.z * lightDir.z;
    const intensity = Math.max(0, dot) * this.config.directionalLight.intensity;
    return { r: pixel.r * (1 + intensity), g: pixel.g * (1 + intensity), b: pixel.b * (1 + intensity) };
  }
}

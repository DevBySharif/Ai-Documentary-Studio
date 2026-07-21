import type { CEFilmGrainConfig, CEFilmGrainType } from "./types.js";

export class CEFilmGrainEngine {
  private seed = 42;

  apply(pixel: { r: number; g: number; b: number }, config: CEFilmGrainConfig, frame: number): { r: number; g: number; b: number } {
    const intensityMap: Record<CEFilmGrainType, number> = {
      fine: 0.03, medium: 0.06, documentary: 0.04, archive: 0.08
    };
    const baseIntensity = intensityMap[config.type] ?? 0.03;
    const noise = (this.noise(frame) - 0.5) * 2 * baseIntensity * config.intensity;

    return {
      r: Math.max(0, Math.min(1, pixel.r + noise)),
      g: Math.max(0, Math.min(1, pixel.g + noise)),
      b: Math.max(0, Math.min(1, pixel.b + noise))
    };
  }

  private noise(frame: number): number {
    this.seed = (this.seed * 16807 + frame * 48271) % 2147483647;
    return (this.seed & 0x7fffffff) / 0x7fffffff;
  }
}

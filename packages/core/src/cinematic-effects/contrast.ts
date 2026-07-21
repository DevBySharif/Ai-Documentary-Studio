import type { CEContrastConfig } from "./types.js";

export class CEContrastEngine {
  apply(pixel: { r: number; g: number; b: number }, config: CEContrastConfig): { r: number; g: number; b: number } {
    const applyContrast = (channel: number, amount: number): number => {
      const factor = (259 * (amount * 255 + 255)) / (255 * (259 - amount * 255));
      return factor * (channel - 0.5) + 0.5;
    };

    let r = applyContrast(pixel.r, config.global);
    let g = applyContrast(pixel.g, config.global);
    let b = applyContrast(pixel.b, config.global);

    if (config.local > 0) {
      const avg = (r + g + b) / 3;
      const localFactor = 1 + config.local * 0.5;
      r += (r - avg) * config.local * 0.2;
      g += (g - avg) * config.local * 0.2;
      b += (b - avg) * config.local * 0.2;
    }

    return {
      r: Math.max(0, Math.min(1, r)),
      g: Math.max(0, Math.min(1, g)),
      b: Math.max(0, Math.min(1, b))
    };
  }
}

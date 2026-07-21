import type { CELensConfig } from "./types.js";

export class CELensEffectsEngine {
  apply(pixel: { r: number; g: number; b: number }, x: number, y: number, width: number, height: number, config: CELensConfig, frame: number): { r: number; g: number; b: number } {
    let result = { ...pixel };

    if (config.lensDirt > 0) {
      const dirt = Math.sin(x * 0.01 + frame * 0.1) * Math.cos(y * 0.01 + frame * 0.08) * 0.5 + 0.5;
      const dirtAmount = dirt * config.lensDirt * 0.05;
      result.r += dirtAmount * 0.3;
      result.g += dirtAmount * 0.2;
    }

    if (config.lightWrap > 0) {
      const edgeDist = Math.min(x, y, width - x, height - y) / Math.min(width, height);
      const wrap = Math.max(0, 1 - edgeDist * 4) * config.lightWrap * 0.1;
      result.r += wrap;
      result.g += wrap;
      result.b += wrap;
    }

    if (config.lensBreathing > 0) {
      const breath = Math.sin(frame * 0.05) * config.lensBreathing * 0.002;
      result.r -= breath;
      result.g -= breath;
      result.b -= breath;
    }

    return {
      r: Math.max(0, Math.min(1, result.r)),
      g: Math.max(0, Math.min(1, result.g)),
      b: Math.max(0, Math.min(1, result.b))
    };
  }
}

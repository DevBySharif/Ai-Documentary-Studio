import type { CEColorGradeConfig, CEGradePreset } from "./types.js";

export class CEColorGradingEngine {
  private presets: Record<CEGradePreset, CEColorGradeConfig> = {
    documentary: { preset: "documentary", lutPath: "", temperature: -5, tint: 0, saturation: 0.85, hueShift: 0 },
    cinema: { preset: "cinema", lutPath: "", temperature: -3, tint: 2, saturation: 0.9, hueShift: 2 },
    educational: { preset: "educational", lutPath: "", temperature: 0, tint: 0, saturation: 1, hueShift: 0 },
    minimal: { preset: "minimal", lutPath: "", temperature: 0, tint: 0, saturation: 0.95, hueShift: 0 },
    monochrome: { preset: "monochrome", lutPath: "", temperature: 0, tint: 0, saturation: 0, hueShift: 0 },
    custom_lut: { preset: "custom_lut", lutPath: "", temperature: 0, tint: 0, saturation: 1, hueShift: 0 }
  };

  getPreset(name: CEGradePreset): CEColorGradeConfig {
    return { ...this.presets[name] ?? this.presets.documentary };
  }

  registerCustom(name: string, config: CEColorGradeConfig): void {
    if (name === "custom_lut") this.presets.custom_lut = config;
  }

  apply(pixel: { r: number; g: number; b: number }, config: CEColorGradeConfig): { r: number; g: number; b: number } {
    let { r, g, b } = pixel;

    if (config.saturation !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * config.saturation;
      g = gray + (g - gray) * config.saturation;
      b = gray + (b - gray) * config.saturation;
    }

    if (config.temperature !== 0) {
      r += config.temperature * 0.01;
      b -= config.temperature * 0.01;
    }

    if (config.tint !== 0) {
      g += config.tint * 0.01;
    }

    return {
      r: Math.max(0, Math.min(1, r)),
      g: Math.max(0, Math.min(1, g)),
      b: Math.max(0, Math.min(1, b))
    };
  }
}

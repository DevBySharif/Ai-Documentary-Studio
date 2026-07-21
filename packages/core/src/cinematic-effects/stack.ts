import type { CEEffectStack, CEColorGradeConfig, CEExposureConfig, CEContrastConfig, CELightingConfig, CEDepthConfig, CEAtmosphereConfig, CELensConfig, CEFilmGrainConfig, CEFinalPolishConfig, CEEffectQuality } from "./types.js";

export class CEEffectStackManager {
  private order: (keyof CEEffectStack)[] = ["colorGrade", "exposure", "contrast", "lighting", "depth", "atmosphere", "lensEffects", "filmGrain", "finalPolish"];

  private qualityProfiles: Record<CEEffectQuality, Partial<CEEffectStack>> = {
    draft: { colorGrade: { preset: "minimal", lutPath: "", temperature: 0, tint: 0, saturation: 0.8, hueShift: 0 } as CEColorGradeConfig, filmGrain: { type: "fine", intensity: 0.05 } as CEFilmGrainConfig },
    preview: { colorGrade: { preset: "documentary", lutPath: "", temperature: 0, tint: 0, saturation: 0.9, hueShift: 0 } as CEColorGradeConfig, filmGrain: { type: "fine", intensity: 0.1 } as CEFilmGrainConfig },
    production: { colorGrade: { preset: "documentary", lutPath: "", temperature: 0, tint: 0, saturation: 1, hueShift: 0 } as CEColorGradeConfig, filmGrain: { type: "documentary", intensity: 0.15 } as CEFilmGrainConfig },
    master: { colorGrade: { preset: "cinema", lutPath: "", temperature: 0, tint: 0, saturation: 1, hueShift: 0 } as CEColorGradeConfig, filmGrain: { type: "documentary", intensity: 0.12 } as CEFilmGrainConfig }
  };

  getOrder(): (keyof CEEffectStack)[] {
    return [...this.order];
  }

  getQualityProfile(quality: CEEffectQuality): Partial<CEEffectStack> {
    return { ...this.qualityProfiles[quality] };
  }

  build(config: Partial<CEEffectStack>): CEEffectStack {
    return {
      colorGrade: config.colorGrade ?? { preset: "documentary", lutPath: "", temperature: 0, tint: 0, saturation: 1, hueShift: 0 },
      exposure: config.exposure ?? { highlights: 0, midtones: 0, shadows: 0, blackPoint: 0, whitePoint: 0 },
      contrast: config.contrast ?? { global: 0.5, local: 0.3, micro: 0.1 },
      lighting: config.lighting ?? { vignette: 0.3, bloom: 0.05, lightRays: 0 },
      depth: config.depth ?? { depthOfField: 0, focalPoint: { x: 0.5, y: 0.5 }, backgroundBlur: 0 },
      atmosphere: config.atmosphere ?? { type: "dust", intensity: 0, speed: 0 },
      lensEffects: config.lensEffects ?? { softLensBlur: 0, lensDirt: 0, lightWrap: 0, lensBreathing: 0 },
      filmGrain: config.filmGrain ?? { type: "fine", intensity: 0.1 },
      finalPolish: config.finalPolish ?? { sharpness: 0.2, noiseReduction: 0.1, saturation: 1 }
    };
  }

  validate(stack: CEEffectStack): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!stack.colorGrade) errors.push("Missing color grade");
    if (stack.filmGrain.intensity > 1) errors.push("Film grain intensity exceeds 1.0");
    if (stack.lighting.vignette > 1) errors.push("Vignette exceeds 1.0");
    if (stack.lighting.bloom > 1) errors.push("Bloom exceeds 1.0");
    if (stack.depth.depthOfField > 1) errors.push("Depth of field exceeds 1.0");
    return { valid: errors.length === 0, errors };
  }
}

import type { CEColorGradeConfig, CEGradePreset } from "./types.js";

export class CEAIColorist {
  analyze(mood: string, subjectVisibility: number, lightingBalance: number, sceneContinuity: number): CEColorGradeConfig {
    const lower = mood.toLowerCase();

    let preset: CEGradePreset = "documentary";
    let temperature = 0;
    let saturation = 0.9;

    if (lower.includes("sad") || lower.includes("reflection") || lower.includes("memory")) {
      preset = "monochrome";
      temperature = -3;
      saturation = 0.3;
    } else if (lower.includes("hope") || lower.includes("warm") || lower.includes("joy")) {
      preset = "cinema";
      temperature = 5;
      saturation = 0.95;
    } else if (lower.includes("fear") || lower.includes("tension") || lower.includes("mystery")) {
      preset = "minimal";
      temperature = -8;
      saturation = 0.7;
    } else if (lower.includes("educational") || lower.includes("explain")) {
      preset = "educational";
      temperature = 0;
      saturation = 1;
    }

    if (subjectVisibility < 0.5) temperature += 3;
    if (lightingBalance < 0.4) saturation = Math.min(1, saturation + 0.1);
    if (sceneContinuity < 0.6) temperature *= 0.5;

    return { preset, lutPath: "", temperature, tint: 0, saturation: Math.max(0, Math.min(1, saturation)), hueShift: 0 };
  }
}

import type { AMValidationResult, AMLoudnessTarget } from "./types.js";

export class AMAudioMixValidator {
  validate(
    hasClipping: boolean,
    loudnessOK: boolean,
    voiceClarity: number,
    duckingApplied: boolean,
    stereoOK: boolean,
    noiseOK: boolean,
    loudnessTarget: AMLoudnessTarget
  ): AMValidationResult {
    return {
      noClipping: !hasClipping,
      loudnessTarget: loudnessOK,
      voiceClarity: voiceClarity >= 0.7,
      duckingAccuracy: duckingApplied,
      stereoCompatibility: stereoOK,
      noiseLevel: noiseOK,
      passed: !hasClipping && loudnessOK && voiceClarity >= 0.7 && duckingApplied && stereoOK && noiseOK
    };
  }

  printReport(result: AMValidationResult): string[] {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(result)) {
      if (key === "passed") continue;
      const status = value ? "✓" : "✗";
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      lines.push(`${status} ${label}`);
    }
    return lines;
  }
}

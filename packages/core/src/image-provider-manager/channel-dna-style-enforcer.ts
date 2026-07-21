import { IPImageResult } from "./types";

export interface IPChannelDNAStyle {
  artStyle: string;
  characterProportions: string;
  cameraPerspective: string;
  colorLanguage: string[];
  lighting: string;
  emotionalTone: string;
}

export interface IPChannelDNAValidationResult {
  compliant: boolean;
  violations: string[];
  score: number;
}

export class IPChannelDNAStyleEnforcer {
  validate(result: IPImageResult, channelDna: IPChannelDNAStyle): IPChannelDNAValidationResult {
    const violations: string[] = [];
    const promptLower = result.promptUsed.toLowerCase();

    const artStyleTokens = channelDna.artStyle.toLowerCase().split(/\s+/);
    const artStyleMatched = artStyleTokens.filter((t) => promptLower.includes(t));
    if (artStyleMatched.length / artStyleTokens.length < 0.4) {
      violations.push(`Art style mismatch: expected "${channelDna.artStyle}"`);
    }

    const colorTokens = channelDna.colorLanguage.map((c) => c.toLowerCase());
    const colorMatched = colorTokens.filter((c) => promptLower.includes(c));
    if (colorMatched.length === 0 && colorTokens.length > 0) {
      violations.push(`Color language mismatch: expected colors like "${colorTokens.join(", ")}"`);
    }

    const lightingTokens = channelDna.lighting.toLowerCase().split(/\s+/);
    const lightingMatched = lightingTokens.filter((t) => promptLower.includes(t));
    if (lightingMatched.length === 0 && lightingTokens.length > 0) {
      violations.push(`Lighting mismatch: expected "${channelDna.lighting}"`);
    }

    const perspectiveTokens = channelDna.cameraPerspective.toLowerCase().split(/\s+/);
    const perspectiveMatched = perspectiveTokens.filter((t) => promptLower.includes(t));
    if (perspectiveMatched.length === 0 && perspectiveTokens.length > 0) {
      violations.push(`Camera perspective mismatch: expected "${channelDna.cameraPerspective}"`);
    }

    const toneTokens = channelDna.emotionalTone.toLowerCase().split(/\s+/);
    const toneMatched = toneTokens.filter((t) => promptLower.includes(t));
    if (toneMatched.length === 0 && toneTokens.length > 0) {
      violations.push(`Emotional tone mismatch: expected "${channelDna.emotionalTone}"`);
    }

    const totalChecks = 5;
    const passed = totalChecks - violations.length;
    const score = Math.round((passed / totalChecks) * 100);

    return {
      compliant: violations.length === 0,
      violations,
      score,
    };
  }

  rejectOrFlag(result: IPImageResult, channelDna: IPChannelDNAStyle): "approved" | "rejected" | "flagged" {
    const validation = this.validate(result, channelDna);

    if (validation.compliant) {
      return "approved";
    }

    if (validation.score >= 50) {
      return "flagged";
    }

    return "rejected";
  }
}

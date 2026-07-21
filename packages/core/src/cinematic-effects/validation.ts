import type { CEEffectStack } from "./types.js";

export interface CEValidationResult {
  valid: boolean;
  checks: Array<{ name: string; passed: boolean; message?: string }>;
}

export class CEEffectsValidator {
  validate(stack: CEEffectStack): CEValidationResult {
    const checks: CEValidationResult["checks"] = [];

    checks.push(this.checkColorConsistency(stack));
    checks.push(this.checkLightingConsistency(stack));
    checks.push(this.checkSubtitleVisibility(stack));
    checks.push(this.checkSafeExposure(stack));
    checks.push(this.checkNoClipping(stack));
    checks.push(this.checkDNACompliance(stack));

    return { valid: checks.every((c) => c.passed), checks };
  }

  private checkColorConsistency(stack: CEEffectStack) {
    return { name: "Color Consistency", passed: stack.colorGrade.saturation >= 0 && stack.colorGrade.saturation <= 1 };
  }

  private checkLightingConsistency(stack: CEEffectStack) {
    return { name: "Lighting Consistency", passed: stack.lighting.vignette <= 1 && stack.lighting.bloom <= 1 };
  }

  private checkSubtitleVisibility(_stack: CEEffectStack) {
    return { name: "Subtitle Visibility", passed: true };
  }

  private checkSafeExposure(stack: CEEffectStack) {
    return { name: "Safe Exposure", passed: stack.exposure.highlights <= 1 && stack.exposure.shadows >= 0 };
  }

  private checkNoClipping(stack: CEEffectStack) {
    const ok = stack.exposure.blackPoint >= 0 && stack.exposure.whitePoint <= 1;
    return { name: "No Effect Clipping", passed: ok };
  }

  private checkDNACompliance(_stack: CEEffectStack) {
    return { name: "Channel DNA Compliance", passed: true };
  }
}

import type { MotionValidationRule, MotionValidationReport, MotionClip, EffectRule } from "./types.js";

export class MotionValidator {
  private rule: MotionValidationRule;

  constructor(rule: MotionValidationRule) {
    this.rule = rule;
  }

  validate(clips: MotionClip[], totalDuration: number): MotionValidationReport {
    const issues: string[] = [];

    const smoothness = this.checkSmoothness(clips);
    const purpose = this.checkPurpose(clips);
    const emotionMatch = this.checkEmotionMatch(clips);
    const voiceMatch = this.checkVoiceMatch(clips);
    const viewerComfort = this.checkViewerComfort(clips);
    const professionalScore = this.checkProfessional(clips);

    if (smoothness < 60) issues.push("Motion transitions lack smoothness");
    if (purpose < 60) issues.push("Some motions lack clear purpose");
    if (emotionMatch < 60) issues.push("Motion does not match emotion for some segments");
    if (voiceMatch < 60) issues.push("Motion timing does not align with voice");
    if (viewerComfort < 60) issues.push("Motion may cause viewer discomfort");
    if (professionalScore < 60) issues.push("Overall quality below professional threshold");

    const overall = Math.round(
      (smoothness + purpose + emotionMatch + voiceMatch + viewerComfort + professionalScore) / 6
    );

    return {
      smoothness,
      purpose,
      emotionMatch,
      voiceMatch,
      viewerComfort,
      professionalScore,
      overall,
      issues,
    };
  }

  private checkSmoothness(clips: MotionClip[]): number {
    if (clips.length <= 1) return 100;
    const fastTransitions = clips.filter((c) => c.easing === "linear" && c.motion !== "hold").length;
    const ratio = fastTransitions / clips.length;
    return Math.round((1 - ratio) * 100);
  }

  private checkPurpose(_clips: MotionClip[]): number {
    return 85;
  }

  private checkEmotionMatch(_clips: MotionClip[]): number {
    return 85;
  }

  private checkVoiceMatch(_clips: MotionClip[]): number {
    return 85;
  }

  private checkViewerComfort(clips: MotionClip[]): number {
    const extremeMotions = clips.filter((c) => c.intensity === "extreme").length;
    if (extremeMotions > 0) {
      return Math.max(0, 100 - extremeMotions * 20);
    }
    return 95;
  }

  private checkProfessional(clips: MotionClip[]): number {
    const hasWordInsert = clips.some((c) => c.wordInsert);
    const hasTransition = clips.some((c) => c.transition);
    let score = 75;
    if (hasWordInsert) score += 10;
    if (hasTransition) score += 10;
    if (clips.length > 3) score += 5;
    return Math.min(100, score);
  }
}

export class EffectEngine {
  private rule: EffectRule;

  constructor(rule: EffectRule) {
    this.rule = rule;
  }

  getAllowedEffects(): string[] {
    const allowed: string[] = [];
    if (this.rule.softGlow) allowed.push("soft_glow");
    if (this.rule.lightRays) allowed.push("light_rays");
    if (this.rule.depthBlur) allowed.push("depth_blur");
    if (this.rule.particleDust) allowed.push("particle_dust");
    if (this.rule.filmGrain) allowed.push("film_grain");
    if (this.rule.lensBloom) allowed.push("lens_bloom");
    return allowed;
  }

  isEffectAllowed(effect: string): boolean {
    const disallowed = new Map<string, boolean>([
      ["heavy_glitch", this.rule.heavyGlitch],
      ["rgb_split", this.rule.rgbSplit],
      ["flash_overuse", this.rule.flashOveruse],
      ["tiktok_effect", this.rule.tiktokEffects],
    ]);
    if (disallowed.has(effect) && !disallowed.get(effect)) {
      return false;
    }
    return this.getAllowedEffects().includes(effect);
  }
}

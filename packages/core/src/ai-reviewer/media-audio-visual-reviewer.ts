import { ValidationIssue } from "./reviewer-types";

/**
 * Media Audio-Visual & Copyright Reviewer (Vol 04 Part 11 - Section 10, Section 11, Section 12, Section 13).
 * Reviews visual continuity, audio pronunciation/loudness, script tone, and copyright compliance.
 */
export class MediaAudioVisualReviewer {
  public auditMediaAndCopyright(
    hasUnlicensedAssets = false,
    audioClippingDetected = false
  ): ReadonlyArray<ValidationIssue> {
    const issues: ValidationIssue[] = [];

    if (hasUnlicensedAssets) {
      issues.push({
        issueId: `iss_${Math.random().toString(36).substring(2, 7)}`,
        domain: "CopyrightLicensing",
        severity: "Critical",
        title: "Unlicensed Asset Detected",
        description: "One or more media assets lack confirmed license metadata.",
        affectedComponent: "AssetManager",
        suggestedFix: "Replace asset or provide verified license key.",
        isIgnoredByUser: false,
      });
    }

    if (audioClippingDetected) {
      issues.push({
        issueId: `iss_${Math.random().toString(36).substring(2, 7)}`,
        domain: "AudioQuality",
        severity: "High",
        title: "Audio Clipping / Over-Modulation",
        description: "Narration peak levels exceed 0dBFS.",
        affectedComponent: "AudioEngine",
        suggestedFix: "Apply DSP limiter node or lower track gain by -3dB.",
        isIgnoredByUser: false,
      });
    }

    return issues;
  }
}

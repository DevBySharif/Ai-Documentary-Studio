import type { AMQualityReport } from "./types.js";

export class AMAudioQualityAI {
  analyze(integratedLUFS: number, truePeak: number, compressionRatio: number, voicePresence: number, noiseFloor: number): AMQualityReport {
    const clipping = truePeak > -1;
    const excessiveCompression = compressionRatio > 6;
    const harshFrequencies = false;
    const voiceMasking = voicePresence < 0.3;
    const loudnessInconsistencies = integratedLUFS < -20 || integratedLUFS > -10;
    const noiseArtifacts = noiseFloor > -50;

    const failed = [clipping, excessiveCompression, harshFrequencies, voiceMasking, loudnessInconsistencies, noiseArtifacts];
    const failures = failed.filter(Boolean).length;
    const overallScore = Math.round((1 - failures / failed.length) * 100);

    const recommendations: string[] = [];
    if (clipping) recommendations.push("Reduce master gain or apply limiter with lower ceiling");
    if (excessiveCompression) recommendations.push("Reduce compression ratio to 4:1 or lower");
    if (voiceMasking) recommendations.push("Increase narration presence in the mix");
    if (loudnessInconsistencies) recommendations.push("Apply loudness normalization to target LUFS");
    if (noiseArtifacts) recommendations.push("Enable noise reduction for floor noise");

    return {
      clipping,
      excessiveCompression,
      harshFrequencies,
      voiceMasking,
      loudnessInconsistencies,
      noiseArtifacts,
      overallScore,
      passed: overallScore >= 70,
      recommendations
    };
  }

  autoCorrect(report: AMQualityReport): { corrections: string[] } {
    const corrections: string[] = [];
    if (report.clipping) corrections.push("limiter_ceiling_-1dB");
    if (report.excessiveCompression) corrections.push("ratio_4_1");
    if (report.voiceMasking) corrections.push("narration_gain_+2dB");
    if (report.loudnessInconsistencies) corrections.push("normalize_-14LUFS");
    if (report.noiseArtifacts) corrections.push("noise_reduction_enable");
    return { corrections };
  }
}

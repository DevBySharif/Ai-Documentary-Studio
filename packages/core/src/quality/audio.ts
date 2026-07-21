import type { CategoryScore } from "./types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

export class AudioQualityInspector {
  inspect(audio: AudioIntelligenceResult): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    if (!audio.quality.passed) {
      score -= 20;
      failures.push(`Audio quality check failed: ${audio.quality.score}`);
    }

    if (audio.quality.clipping) {
      score -= 15;
      failures.push("Audio clipping detected");
    }

    if (audio.quality.backgroundNoise > 0.3) {
      score -= 10;
      warnings.push(`High background noise: ${Math.round(audio.quality.backgroundNoise * 100)}%`);
    }

    if (audio.quality.missingTimestamps.length > 0) {
      score -= 10;
      warnings.push(`${audio.quality.missingTimestamps.length} missing timestamps`);
    }

    const wpm = audio.speechRate.wordsPerMinute;
    if (wpm > 200) {
      score -= 10;
      warnings.push(`Fast speaking rate: ${wpm} WPM`);
    } else if (wpm < 100) {
      score -= 5;
      warnings.push(`Slow speaking rate: ${wpm} WPM`);
    }

    if (audio.whisper.words.length < 10) {
      score -= 15;
      failures.push("Very few words transcribed");
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      maxScore: 100,
      passed: score >= 70,
      warnings,
      failures,
    };
  }
}

import type { MRVelocityConfig } from "./types.js";

export class MRVelocityController {
  calculate(baseSpeed: number, emotionFactor: number, narrationSpeed: number, sceneDuration: number, subjectSize: number, dnaFactor: number): MRVelocityConfig {
    const sceneDurationFactor = Math.min(1, sceneDuration / 30);
    const subjectSizeFactor = Math.min(1, subjectSize / 500);
    const finalSpeed = baseSpeed * emotionFactor * narrationSpeed * sceneDurationFactor * subjectSizeFactor * dnaFactor;

    return {
      baseSpeed,
      emotionFactor,
      narrationFactor: narrationSpeed,
      sceneDurationFactor,
      subjectSizeFactor,
      dnaFactor,
      finalSpeed: Math.max(0.1, Math.min(10, finalSpeed))
    };
  }

  adjustForEmotion(emotion: string): number {
    const map: Record<string, number> = {
      curiosity: 0.8, hope: 0.7, fear: 1.2, wonder: 0.6, reflection: 0.4, urgency: 1.5, neutral: 1.0
    };
    return map[emotion] ?? 1.0;
  }

  adjustForNarration(wpm: number): number {
    if (wpm > 180) return 1.3;
    if (wpm > 150) return 1.1;
    if (wpm > 120) return 1.0;
    return 0.8;
  }
}

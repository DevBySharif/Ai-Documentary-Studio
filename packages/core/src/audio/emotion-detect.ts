import type { VoiceEmotion, WordTimestamp } from "./types.js";

const ENERGY_THRESHOLDS = {
  calm: { min: 0.1, max: 0.4 },
  curious: { min: 0.3, max: 0.6 },
  fearful: { min: 0.2, max: 0.5 },
  excited: { min: 0.6, max: 1.0 },
  reflective: { min: 0.1, max: 0.3 },
  confident: { min: 0.4, max: 0.7 },
  urgent: { min: 0.6, max: 0.9 },
  inspirational: { min: 0.5, max: 0.8 },
};

export class VoiceEmotionDetector {
  detect(words: WordTimestamp[], speechRate: number): VoiceEmotion {
    const avgEnergy = words.reduce((s, w) => s + (w.vocalEnergy || 0.5), 0) / words.length;
    const speedFactor = speechRate / 150;

    for (const [emotion, thresholds] of Object.entries(ENERGY_THRESHOLDS)) {
      if (avgEnergy >= thresholds.min && avgEnergy <= thresholds.max) {
        if (speedFactor > 1.3 && (emotion === "excited" || emotion === "urgent")) {
          return emotion as VoiceEmotion;
        }
        if (speedFactor < 0.8 && (emotion === "calm" || emotion === "reflective")) {
          return emotion as VoiceEmotion;
        }
        return emotion as VoiceEmotion;
      }
    }

    return "calm";
  }
}

import { VPEmotion, VPProviderName } from "./types";

export interface VPEmotionProfile {
  pitch: number;
  speed: number;
  volume: number;
  emphasis: "strong" | "moderate" | "reduced";
}

const EMOTION_PROFILES: Record<VPEmotion, VPEmotionProfile> = {
  calm: { pitch: -5, speed: 0.9, volume: -2, emphasis: "reduced" },
  inspirational: { pitch: 10, speed: 1.1, volume: 3, emphasis: "strong" },
  serious: { pitch: -10, speed: 0.85, volume: 0, emphasis: "moderate" },
  dramatic: { pitch: 15, speed: 1.2, volume: 5, emphasis: "strong" },
  curious: { pitch: 8, speed: 1.05, volume: 1, emphasis: "moderate" },
  neutral: { pitch: 0, speed: 1.0, volume: 0, emphasis: "moderate" },
  confident: { pitch: 5, speed: 1.0, volume: 2, emphasis: "strong" },
};

const EMOTION_SUPPORT: Map<VPProviderName, VPEmotion[]> = new Map([
  ["elevenlabs", ["calm", "inspirational", "serious", "dramatic", "curious", "neutral", "confident"]],
  ["google_cloud_tts", ["calm", "neutral", "serious"]],
  ["azure_speech", ["calm", "serious", "neutral", "confident"]],
  ["openai_tts", ["calm", "neutral", "confident"]],
  ["kokoro", ["calm", "inspirational", "serious", "dramatic", "curious", "neutral", "confident"]],
  ["edge_tts", ["neutral"]],
  ["piper", ["neutral"]],
  ["amazon_polly", ["neutral", "serious"]],
]);

export class VPEmotionControl {
  getEmotionProfile(emotion: VPEmotion): VPEmotionProfile {
    const profile = EMOTION_PROFILES[emotion];
    if (!profile) {
      return EMOTION_PROFILES.neutral;
    }
    return { ...profile };
  }

  applyToSSML(ssml: string, emotion: VPEmotion): string {
    const profile = this.getEmotionProfile(emotion);
    const prosodyAttrs = [
      profile.pitch !== 0 ? `pitch="${profile.pitch >= 0 ? "+" : ""}${profile.pitch}%"` : "",
      profile.speed !== 1.0 ? `rate="${Math.round(profile.speed * 100)}%"` : "",
      profile.volume !== 0 ? `volume="${profile.volume >= 0 ? "+" : ""}${profile.volume}dB"` : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (!prosodyAttrs) {
      return ssml;
    }

    const speakTag = "</speak>";
    const speakIndex = ssml.lastIndexOf(speakTag);
    if (speakIndex === -1) {
      return `<speak><prosody ${prosodyAttrs}>${ssml}</prosody></speak>`;
    }

    const inner = ssml.substring(ssml.indexOf(">", ssml.indexOf("<speak")) + 1, speakIndex);
    return `<speak><prosody ${prosodyAttrs}>${inner}</prosody></speak>`;
  }

  getSupportedEmotions(provider: VPProviderName): VPEmotion[] {
    return EMOTION_SUPPORT.get(provider) || ["neutral"];
  }

  getAllProfiles(): Record<VPEmotion, VPEmotionProfile> {
    const result: Record<string, VPEmotionProfile> = {};
    for (const [key, val] of Object.entries(EMOTION_PROFILES)) {
      result[key] = { ...val };
    }
    return result as Record<VPEmotion, VPEmotionProfile>;
  }
}

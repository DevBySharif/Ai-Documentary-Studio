import type { VoiceDNAProfile, AudioNormalizationConfig } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { ProjectDNA } from "../project/types.js";

export function createDefaultVoiceDNA(): VoiceDNAProfile {
  return {
    voiceModel: "en-US-JennyNeural",
    gender: "female",
    speakingStyle: "conversational_documentary",
    speechRate: 1.0,
    pitch: 1.0,
    energy: 0.7,
    accent: "us",
    pauseStyle: "normal",
  };
}

export class VoiceDNAManager {
  compile(channelDNA: ChannelDNA): VoiceDNAProfile {
    const general = channelDNA.general;
    const zenn = createDefaultVoiceDNA();

    return {
      voiceModel: zenn.voiceModel,
      gender: zenn.gender,
      speakingStyle: general.writingDifficulty === "academic" ? "formal_documentary" :
        general.writingDifficulty === "conversational" ? "conversational_documentary" : "moderate",
      speechRate: general.writingDifficulty === "academic" ? 0.9 :
        general.writingDifficulty === "conversational" ? 1.1 : 1.0,
      pitch: 1.0,
      energy: 0.7,
      accent: "us",
      pauseStyle: "normal",
    };
  }

  applyProjectOverrides(base: VoiceDNAProfile, projectDNA: ProjectDNA): VoiceDNAProfile {
    const audio = projectDNA.audio;
    return {
      ...base,
      speechRate: audio.speakingSpeed === "slow" ? 0.85 :
        audio.speakingSpeed === "fast" ? 1.2 : 1.0,
      energy: audio.voiceEnergy === "low" ? 0.5 :
        audio.voiceEnergy === "high" ? 1.0 : 0.7,
      pauseStyle: audio.pauseFrequency === "few" ? "few" :
        audio.pauseFrequency === "many" ? "many" : "normal",
    };
  }
}

export function createNormalizationConfig(): AudioNormalizationConfig {
  return {
    targetLoudness: -16,
    peakLevel: -1.0,
    noiseFloor: -50,
    sampleRate: 16000,
    channelFormat: "mono",
  };
}

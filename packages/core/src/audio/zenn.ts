import type { VoiceDNAProfile } from "./types.js";

export function createZennAudioProfile(): VoiceDNAProfile {
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

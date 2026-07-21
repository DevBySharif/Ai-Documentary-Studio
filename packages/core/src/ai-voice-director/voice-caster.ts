import { VoiceProfile, SpeakerRole, NarrationStyle } from "./voice-types";

/**
 * Intelligent Voice Caster (Vol 04 Part 08 - Section 5, Section 12).
 * Recommends voices based on documentary genre, audience, emotion, accent, and speaker roles.
 */
export class VoiceCaster {
  private availableVoices: VoiceProfile[] = [
    { voiceId: "v_david", name: "David (Authoritative)", gender: "Male", accent: "British Received Pronunciation", vocalTexture: "Deep, Resonant, Warm", idealGenre: "Historical" },
    { voiceId: "v_sarah", name: "Sarah (Investigative)", gender: "Female", accent: "American General", vocalTexture: "Clear, Precise, Engaging", idealGenre: "Investigative" },
    { voiceId: "v_elena", name: "Elena (Scientific)", gender: "Female", accent: "Mid-Atlantic", vocalTexture: "Calm, Articulate", idealGenre: "Scientific" },
  ];

  public castVoice(role: SpeakerRole, style: NarrationStyle): VoiceProfile {
    if (style === "Historical" || role === "HistoricalQuotation") {
      return this.availableVoices[0]; // David
    }
    if (style === "Investigative") {
      return this.availableVoices[1]; // Sarah
    }
    return this.availableVoices[2]; // Elena
  }
}

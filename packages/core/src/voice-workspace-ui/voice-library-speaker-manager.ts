import { VoiceProfileDescriptor, SpeakerAssignment, SpeakerRoleType } from "./voice-ui-types";

/**
 * Voice Library, Multi-Speaker Manager & Human Recording Studio (Vol 05 Part 10 - Section 4, Section 5, Section 6, Section 7, Section 8).
 * Manages AI/human voice profiles, multi-speaker role assignments, and punch-in live recording takes.
 */
export class VoiceLibrarySpeakerManager {
  private voices: VoiceProfileDescriptor[] = [
    {
      voiceId: "voice_david_uk",
      name: "David (British Narrator)",
      isAiGenerated: true,
      language: "en-GB",
      accent: "RP British",
      gender: "Male",
      speakingStyle: "Documentary Gravitas",
      supportedEmotions: ["Serious", "Dramatic", "Reflective", "Neutral"],
      sampleAudioUrl: "https://assets.studio.internal/voice_david_sample.mp3",
    },
  ];

  private speakers: SpeakerAssignment[] = [
    {
      speakerId: "spk_1",
      name: "Primary Documentary Narrator",
      role: "MainNarrator",
      assignedVoiceId: "voice_david_uk",
    },
  ];

  public getVoices(): ReadonlyArray<VoiceProfileDescriptor> {
    return this.voices;
  }

  public getSpeakers(): ReadonlyArray<SpeakerAssignment> {
    return this.speakers;
  }

  public assignVoiceToSpeaker(speakerId: string, voiceId: string): void {
    const spk = this.speakers.find((s) => s.speakerId === speakerId);
    if (spk) {
      const idx = this.speakers.indexOf(spk);
      this.speakers[idx] = { ...spk, assignedVoiceId: voiceId };
    }
  }

  public recordPunchInTake(speakerId: string, durationSecs: number): { takeId: string; audioUrl: string } {
    return {
      takeId: `take_${Math.random().toString(36).substring(2, 7)}`,
      audioUrl: `d:/Youtube/Ai Documentary Studio/voice/takes/rec_${Date.now()}.wav`,
    };
  }
}

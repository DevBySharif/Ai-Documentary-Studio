import type { AudioIntelligenceResult } from "../audio/types.js";

export class TimelineClock {
  private audioDuration: number = 0;

  setAudioSource(audio: AudioIntelligenceResult): void {
    this.audioDuration = audio.metadata.duration;
  }

  getDuration(): number {
    return this.audioDuration;
  }

  alignToAudio(time: number): number {
    return Math.max(0, Math.min(time, this.audioDuration));
  }

  reset(): void {
    this.audioDuration = 0;
  }
}

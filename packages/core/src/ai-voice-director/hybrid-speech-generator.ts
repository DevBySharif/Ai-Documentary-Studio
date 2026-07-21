export interface MusicDuckingRecommendation {
  readonly sceneId: string;
  readonly duckVolumeDb: number; // e.g. -12dB during narration
  readonly fadeInMs: number;
  readonly fadeOutMs: number;
  readonly silenceBeforeSpeechMs: number;
}

export interface HybridAudioTrackMapping {
  readonly sceneId: string;
  readonly isHumanNarration: boolean;
  readonly audioFilePath: string;
  readonly durationSecs: number;
}

/**
 * Hybrid Speech & Music-Aware Director (Vol 04 Part 08 - Section 14, Section 15, Section 16).
 * Coexists human + AI voice tracks and provides music ducking & timing recommendations.
 */
export class HybridSpeechGenerator {
  public generateMusicDucking(sceneId: string): MusicDuckingRecommendation {
    return {
      sceneId,
      duckVolumeDb: -14, // Standard documentary ducking depth
      fadeInMs: 400,
      fadeOutMs: 600,
      silenceBeforeSpeechMs: 300,
    };
  }

  public alignHumanNarration(sceneId: string, humanAudioPath: string, recordedDurationSecs: number): HybridAudioTrackMapping {
    return {
      sceneId,
      isHumanNarration: true,
      audioFilePath: humanAudioPath,
      durationSecs: recordedDurationSecs,
    };
  }
}

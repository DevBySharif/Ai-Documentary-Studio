import type { AIntWord, AIntEmotionSegment, AIntEmphasis, AIntPause, AIntPhrase, AIntSentence, AIntSemanticAudioMap } from "./types.js";
import { AIntEmotionDetector } from "./emotion.js";
import { AIntEmphasisDetector } from "./emphasis.js";

export class AIntAudioSemanticFusion {
  private emotionDetector = new AIntEmotionDetector();
  private emphasisDetector = new AIntEmphasisDetector();

  fuse(
    words: AIntWord[],
    phrases: AIntPhrase[],
    sentences: AIntSentence[],
    pauses: AIntPause[],
    pitchData?: number[],
    volumeData?: number[]
  ): AIntSemanticAudioMap {
    const emotion = this.emotionDetector.detect(sentences);
    const emphasis = this.emphasisDetector.detect(words, pitchData, volumeData);

    return {
      words,
      emotion,
      emphasis,
      pauses,
      phrases,
      sentences
    };
  }

  getDominantNarrativeRole(map: AIntSemanticAudioMap): string {
    const roles = map.sentences.map((s) => s.narrativeRole);
    const counts: Record<string, number> = {};
    for (const r of roles) counts[r] = (counts[r] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "exposition";
  }
}

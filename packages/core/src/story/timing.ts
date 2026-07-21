import type { TaggedSentence } from "./types.js";
import type { ScriptScene } from "./types.js";

const WORDS_PER_SECOND = 2.8;
const PAUSE_SECONDS = 0.6;
const SCENE_TRANSITION_PAUSE = 0.8;

export class TimingEstimator {
  estimateSentence(sentence: TaggedSentence): TaggedSentence {
    const baseDuration = sentence.wordCount / WORDS_PER_SECOND;
    const pauseDuration = sentence.pauseAfter ? PAUSE_SECONDS : 0;
    return {
      ...sentence,
      estimatedDuration: Math.round((baseDuration + pauseDuration) * 10) / 10,
    };
  }

  estimateScene(scene: ScriptScene): ScriptScene {
    let total = 0;
    const narration = scene.narration.map((s) => {
      const estimated = this.estimateSentence(s);
      total += estimated.estimatedDuration;
      return estimated;
    });
    total += SCENE_TRANSITION_PAUSE;
    return {
      ...scene,
      narration,
      estimatedDuration: Math.round(total * 10) / 10,
    };
  }

  estimateSentences(sentences: TaggedSentence[]): TaggedSentence[] {
    return sentences.map((s) => this.estimateSentence(s));
  }
}

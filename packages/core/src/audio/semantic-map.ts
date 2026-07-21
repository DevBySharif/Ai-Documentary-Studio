import type { SemanticAudioSegment, WordTimestamp } from "./types.js";
import type { EmotionTag } from "../story/types.js";
import type { SceneObjective } from "../narrative/types.js";

const HIGH_IMPACT_CONCEPTS = new Set([
  "brain", "memory", "identity", "consciousness", "mind", "fear",
  "dopamine", "habit", "silence", "dream", "freedom", "time",
  "prediction", "reality", "perception", "emotion", "thought",
  "neuron", "synapse", "cortex", "amygdala", "hippocampus",
]);

export class SemanticAudioMapGenerator {
  generate(
    words: WordTimestamp[],
    sceneObjectives: SceneObjective[],
    _concepts: string[]
  ): SemanticAudioSegment[] {
    const segments: SemanticAudioSegment[] = [];
    let currentSegment: { words: WordTimestamp[]; emotion: EmotionTag; concept: string } | null = null;

    for (const word of words) {
      const matchedObjective = sceneObjectives.find(
        (o) => word.start >= o.sceneId * 5 && word.start < (o.sceneId + 1) * 5
      );
      const concept = this.detectConcept(word.word) ||
        matchedObjective?.knowledge || "general";
      const emotion = matchedObjective?.emotion as EmotionTag || "calm";

      if (!currentSegment) {
        currentSegment = { words: [word], emotion, concept };
      } else if (
        currentSegment.concept !== concept ||
        currentSegment.emotion !== emotion ||
        word.start - currentSegment.words[currentSegment.words.length - 1].end > 1.0
      ) {
        segments.push(this.buildSegment(currentSegment));
        currentSegment = { words: [word], emotion, concept };
      } else {
        currentSegment.words.push(word);
      }
    }

    if (currentSegment) {
      segments.push(this.buildSegment(currentSegment));
    }

    return segments;
  }

  private detectConcept(word: string): string | null {
    const lower = word.toLowerCase().replace(/[.,!?;:]/g, "");
    if (HIGH_IMPACT_CONCEPTS.has(lower)) return lower;
    return null;
  }

  private buildSegment(data: { words: WordTimestamp[]; emotion: EmotionTag; concept: string }): SemanticAudioSegment {
    const duration = data.words[data.words.length - 1].end - data.words[0].start;
    return {
      start: data.words[0].start,
      end: data.words[data.words.length - 1].end,
      text: data.words.map((w) => w.word).join(" "),
      dominantConcept: data.concept,
      emotion: data.emotion,
      importance: HIGH_IMPACT_CONCEPTS.has(data.concept.toLowerCase()) ? 8 : 4,
      imageStrategy: HIGH_IMPACT_CONCEPTS.has(data.concept.toLowerCase()) ? "word_insert" : "reuse",
      suggestedMotion: data.emotion === "reflection" ? "hold" :
        data.emotion === "curiosity" ? "push_in" : "slow_zoom_in",
      transitionPreference: data.emotion === "calm" ? "cross_fade" : "cut",
    };
  }
}

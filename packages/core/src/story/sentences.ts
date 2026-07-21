import type {
  TaggedSentence, EmotionTag, VisualIntent, FactType, ConceptTag,
} from "./types.js";
import type { SceneObjective } from "../narrative/types.js";

const EMOTION_FOR_PURPOSE: Record<string, EmotionTag> = {
  hook: "curiosity",
  context: "calm",
  explain: "wonder",
  reveal: "surprise",
  evidence: "reflection",
  summarize: "reflection",
  cta: "urgency",
  transition: "calm",
};

const VISUAL_INTENT_FOR_PURPOSE: Record<string, VisualIntent> = {
  hook: "new_scene",
  context: "symbolic_visual",
  explain: "diagram",
  reveal: "symbolic_visual",
  evidence: "close_up",
  summarize: "wide_shot",
  cta: "wide_shot",
};

const FACT_TYPE_FOR_PURPOSE: Record<string, FactType> = {
  hook: "verified_fact",
  context: "verified_fact",
  explain: "interpretation",
  reveal: "interpretation",
  evidence: "verified_fact",
  summarize: "interpretation",
  cta: "opinion",
};

export class SentenceEngine {
  generateSentences(
    objective: SceneObjective,
    concepts: string[],
    existingConceptPool: Set<string>
  ): TaggedSentence[] {
    const sentences: TaggedSentence[] = [];
    const purposeKey = objective.purpose;
    const baseEmotion = EMOTION_FOR_PURPOSE[purposeKey] || "calm";
    const baseVisualIntent = VISUAL_INTENT_FOR_PURPOSE[purposeKey] || "symbolic_visual";
    const baseFactType = FACT_TYPE_FOR_PURPOSE[purposeKey] || "interpretation";
    const difficulty = objective.density === "very_high" ? "advanced" :
      objective.density === "high" ? "intermediate" : "beginner";
    const targetSentenceCount = difficulty === "beginner" ? 2 :
      difficulty === "intermediate" ? 3 : 4;

    let introConcept = this.selectPrimaryConcept(objective, concepts, existingConceptPool);
    if (introConcept) existingConceptPool.add(introConcept);

    for (let i = 0; i < targetSentenceCount; i++) {
      const isFirst = i === 0;
      const isLast = i === targetSentenceCount - 1;
      const text = this.buildText(objective, concepts, i, targetSentenceCount);
      const sentenceConcepts = this.extractConcepts(text, concepts);
      const factType = isFirst ? baseFactType :
        isLast ? "interpretation" : baseFactType;
      const emotion = isFirst ? "curiosity" :
        isLast ? baseEmotion : "calm";
      const visualIntent = isFirst ? baseVisualIntent :
        isLast ? "image_reuse" : baseVisualIntent;

      sentences.push({
        index: i,
        text,
        emotion,
        visualIntent,
        concepts: sentenceConcepts,
        factType,
        estimatedDuration: text.split(" ").length * 0.32,
        wordCount: text.split(" ").length,
        sceneIndex: objective.sceneId,
        pauseAfter: isLast,
        emphasisWords: this.identifyEmphasis(text, sentenceConcepts),
      });
    }

    return sentences;
  }

  private selectPrimaryConcept(
    objective: SceneObjective,
    availableConcepts: string[],
    existingPool: Set<string>
  ): string | null {
    const used = objective.knowledge;
    if (useConcept(used, existingPool)) return used;
    for (const c of availableConcepts) {
      if (!existingPool.has(c)) return c;
    }
    return null;
  }

  private buildText(
    objective: SceneObjective,
    concepts: string[],
    sentenceIndex: number,
    total: number
  ): string {
    const main = objective.goal || objective.knowledge;
    if (total === 1) return `${main}.`;
    if (sentenceIndex === 0) return `Let's talk about ${main}.`;
    if (sentenceIndex === total - 1) return `This is why ${main} matters.`;
    const alt = concepts[sentenceIndex % concepts.length] || main;
    return `${main} connects directly to ${alt}.`;
  }

  private extractConcepts(text: string, availableConcepts: string[]): ConceptTag[] {
    return availableConcepts
      .filter((c) => text.toLowerCase().includes(c.toLowerCase()))
      .map((c, i) => ({
        term: c,
        importance: i === 0 ? 1.0 : 0.7,
        isPrimary: i === 0,
      }));
  }

  private identifyEmphasis(text: string, concepts: ConceptTag[]): string[] {
    const words = text
      .replace(/[.,!?;:]/g, "")
      .split(" ")
      .filter((w) => w.length > 4);
    const conceptTerms = new Set(concepts.map((c) => c.term.toLowerCase()));
    return words.filter((w) => conceptTerms.has(w.toLowerCase()));
  }
}

function useConcept(concept: string, pool: Set<string>): boolean {
  if (!concept) return false;
  return !pool.has(concept);
}

import type { ConceptCluster, SegmentType } from "./types.js";
import type { TaggedSentence } from "../story/types.js";

export class ConceptDetector {
  detect(sentence: TaggedSentence, previousConcept?: string): ConceptCluster {
    const concepts = sentence.concepts.map((c) => String(c));
    const primary = concepts[0] ?? "unknown";
    const secondary = concepts.length > 1 ? concepts.slice(1) : [];

    return {
      primary,
      secondary,
      supporting: [],
    };
  }

  detectSegmentType(concept: ConceptCluster, isQuestion: boolean, isReveal: boolean, isMetaphor: boolean): SegmentType {
    if (isQuestion) return "question";
    if (isReveal) return "reveal";
    if (isMetaphor) return "metaphor";
    return "explanation";
  }

  extractKeywords(text: string, importance: number): string[] {
    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
    const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "can", "could", "may", "might", "shall", "should", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "and", "but", "or", "nor", "not", "so", "yet", "both", "either", "neither", "each", "every", "all", "any", "few", "more", "most", "other", "some", "such", "no", "nor", "only", "own", "same", "very", "this", "that", "these", "those"]);
    return words.filter((w) => !stopWords.has(w) && w.length > 2).slice(0, 5);
  }
}

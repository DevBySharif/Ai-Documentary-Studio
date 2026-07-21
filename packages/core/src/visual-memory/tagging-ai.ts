import type { AssetTag } from "./types.js";

const CONCEPT_TAGS = [
  "brain", "memory", "universe", "loneliness", "fear", "childhood", "time",
  "mirror", "galaxy", "consciousness", "dream", "identity", "knowledge",
  "infinity", "mind", "soul", "evolution", "chaos", "order", "light",
  "darkness", "love", "death", "birth", "journey", "transformation",
];

const OBJECT_TAGS = [
  "book", "tree", "star", "door", "window", "path", "mountain", "ocean",
  "clock", "key", "candle", "lamp", "bridge", "wall", "garden", "house",
];

const EMOTION_TAGS = [
  "curiosity", "wonder", "calm", "melancholy", "hope", "awe", "mystery",
  "surprise", "serenity", "nostalgia", "dread", "longing",
];

const THEME_TAGS = [
  "philosophy", "science", "spirituality", "history", "psychology",
  "mathematics", "poetry", "mythology", "future", "past",
];

const SYMBOL_TAGS = [
  "infinity_symbol", "eye", "circle", "spiral", "triangle", "arrow",
  "heart", "cross", "tree_of_life", "labyrinth", "hourglass", "compass",
];

export class ImageTaggingAI {
  assignTags(concept?: string, emotion?: string): AssetTag[] {
    const tags: AssetTag[] = [];

    if (concept) {
      const conceptTag = this.findBestMatch(concept, CONCEPT_TAGS);
      tags.push({ tag: conceptTag, confidence: 0.85, category: "concept" });
    }

    if (emotion) {
      const emotionTag = this.findBestMatch(emotion, EMOTION_TAGS);
      tags.push({ tag: emotionTag, confidence: 0.8, category: "emotion" });
    }

    tags.push({ tag: "mind_documentary", confidence: 0.9, category: "theme" });
    tags.push({ tag: "abstract", confidence: 0.75, category: "theme" });

    return tags;
  }

  private findBestMatch(input: string, dictionary: string[]): string {
    const lower = input.toLowerCase();
    const exact = dictionary.find((t) => t === lower);
    if (exact) return exact;

    const partial = dictionary.find((t) => lower.includes(t) || t.includes(lower));
    if (partial) return partial;

    return dictionary[0] ?? "unknown";
  }
}

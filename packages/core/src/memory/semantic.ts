import type { SemanticMemoryEntry } from "./types.js";

const CANONICAL_CONCEPTS = new Map<string, string>([
  ["brain", "brain"],
  ["brain predicts", "prediction"],
  ["brain expects", "prediction"],
  ["predict future", "prediction"],
  ["future", "prediction"],
  ["memory", "memory"],
  ["remember", "memory"],
  ["forget", "memory"],
  ["identity", "identity"],
  ["who you are", "identity"],
  ["fear", "fear"],
  ["afraid", "fear"],
  ["scared", "fear"],
  ["habit", "habit"],
  ["routine", "habit"],
  ["dopamine", "dopamine"],
  ["reward", "dopamine"],
  ["pleasure", "dopamine"],
  ["silence", "silence"],
  ["quiet", "silence"],
  ["consciousness", "consciousness"],
  ["awareness", "consciousness"],
]);

export class SemanticMemoryStore {
  private store = new Map<string, SemanticMemoryEntry>();
  private textIndex = new Map<string, string>();

  add(entry: SemanticMemoryEntry): void {
    const key = entry.normalizedConcept.toLowerCase();
    if (!this.store.has(key)) {
      this.store.set(key, entry);
    }
    for (const word of entry.originalText.toLowerCase().split(/\s+/)) {
      this.textIndex.set(word, key);
    }
  }

  findByMeaning(text: string): SemanticMemoryEntry | undefined {
    const normalized = this.normalize(text);
    return this.store.get(normalized);
  }

  findImagesForMeaning(text: string): string[] {
    const entry = this.findByMeaning(text);
    return entry?.imageIds || [];
  }

  normalize(text: string): string {
    const lower = text.toLowerCase().trim();
    for (const [key, concept] of CANONICAL_CONCEPTS) {
      if (lower.includes(key)) return concept;
    }
    return lower.slice(0, 30);
  }

  isSameMeaning(textA: string, textB: string): boolean {
    return this.normalize(textA) === this.normalize(textB);
  }

  size(): number {
    return this.store.size;
  }
}

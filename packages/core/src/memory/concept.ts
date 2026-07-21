import type { ConceptMemoryEntry, SymbolMemoryEntry } from "./types.js";

export class ConceptMemoryStore {
  private store = new Map<string, ConceptMemoryEntry>();

  add(entry: ConceptMemoryEntry): void {
    const key = entry.concept.toLowerCase();
    const existing = this.store.get(key);
    if (existing) {
      existing.imageIds.push(...entry.imageIds.filter((id) => !existing.imageIds.includes(id)));
      existing.promptIds.push(...entry.promptIds.filter((id) => !existing.promptIds.includes(id)));
      existing.useCount++;
      existing.lastUsed = new Date().toISOString();
    } else {
      this.store.set(key, { ...entry, imageIds: [...entry.imageIds], promptIds: [...entry.promptIds] });
    }
  }

  get(concept: string): ConceptMemoryEntry | undefined {
    return this.store.get(concept.toLowerCase());
  }

  hasConcept(concept: string): boolean {
    return this.store.has(concept.toLowerCase());
  }

  getPreferredImage(concept: string): string | undefined {
    const entry = this.get(concept);
    return entry?.imageIds[0];
  }

  size(): number {
    return this.store.size;
  }
}

export class SymbolMemoryStore {
  private store = new Map<string, SymbolMemoryEntry>();

  add(entry: SymbolMemoryEntry): void {
    this.store.set(entry.concept.toLowerCase(), entry);
  }

  get(concept: string): SymbolMemoryEntry | undefined {
    return this.store.get(concept.toLowerCase());
  }

  shouldReuse(concept: string): boolean {
    const entry = this.get(concept);
    if (!entry) return false;
    return entry.reuseRule === "always" || entry.reuseRule === "prefer_reuse";
  }

  getImageId(concept: string): string | undefined {
    return this.get(concept)?.imageId;
  }

  size(): number {
    return this.store.size;
  }
}

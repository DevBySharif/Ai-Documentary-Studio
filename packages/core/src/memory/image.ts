import type { ImageMemoryEntry, PromptMemoryEntry } from "./types.js";

export class ImageMemoryStore {
  private images = new Map<string, ImageMemoryEntry>();
  private conceptIndex = new Map<string, string[]>();

  add(entry: ImageMemoryEntry): void {
    this.images.set(entry.imageId, entry);
    const existing = this.conceptIndex.get(entry.concept.toLowerCase()) || [];
    existing.push(entry.imageId);
    this.conceptIndex.set(entry.concept.toLowerCase(), existing);
  }

  get(imageId: string): ImageMemoryEntry | undefined {
    return this.images.get(imageId);
  }

  findByConcept(concept: string): ImageMemoryEntry[] {
    const ids = this.conceptIndex.get(concept.toLowerCase()) || [];
    return ids.map((id) => this.images.get(id)).filter(Boolean) as ImageMemoryEntry[];
  }

  findBestMatch(concept: string, threshold: number): ImageMemoryEntry | null {
    const candidates = this.findByConcept(concept)
      .filter((img) => img.similarityScore >= threshold && img.reuseCount < 5)
      .sort((a, b) => b.similarityScore - a.similarityScore);
    return candidates[0] || null;
  }

  incrementReuse(imageId: string): void {
    const img = this.images.get(imageId);
    if (img) {
      img.reuseCount++;
      img.lastUsedTime = new Date().toISOString();
    }
  }

  size(): number {
    return this.images.size;
  }
}

export class PromptMemoryStore {
  private prompts = new Map<string, PromptMemoryEntry>();

  add(entry: PromptMemoryEntry): void {
    this.prompts.set(entry.promptId, entry);
  }

  get(promptId: string): PromptMemoryEntry | undefined {
    return this.prompts.get(promptId);
  }

  findBestForConcept(concept: string): PromptMemoryEntry | null {
    const candidates = Array.from(this.prompts.values())
      .filter((p) => p.concept.toLowerCase() === concept.toLowerCase() && p.generationSuccess)
      .sort((a, b) => (b.promptScore + b.imageQuality) - (a.promptScore + a.imageQuality));
    return candidates[0] || null;
  }

  size(): number {
    return this.prompts.size;
  }
}

export class ImageReuseDetector {
  constructor(private imageMemory: ImageMemoryStore) {}

  shouldReuse(concept: string, minSimilarity: number): { reuse: boolean; image?: ImageMemoryEntry } {
    const best = this.imageMemory.findBestMatch(concept, minSimilarity);
    if (best) {
      return { reuse: true, image: best };
    }
    return { reuse: false };
  }
}

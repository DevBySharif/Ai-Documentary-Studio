import type { ImageLibraryEntry, CameraAngle, EmotionTag } from "./types.js";

export class ImageLibrary {
  private entries = new Map<string, ImageLibraryEntry>();
  private sceneIndex = new Map<number, string[]>();

  add(entry: ImageLibraryEntry): void {
    this.entries.set(entry.imageId, entry);
    const existing = this.sceneIndex.get(entry.sceneId) || [];
    existing.push(entry.imageId);
    this.sceneIndex.set(entry.sceneId, existing);
  }

  get(imageId: string): ImageLibraryEntry | undefined {
    return this.entries.get(imageId);
  }

  getByScene(sceneId: number): ImageLibraryEntry[] {
    const ids = this.sceneIndex.get(sceneId) || [];
    return ids.map((id) => this.entries.get(id)).filter(Boolean) as ImageLibraryEntry[];
  }

  getAll(): ImageLibraryEntry[] {
    return Array.from(this.entries.values());
  }

  getReusableForConcept(concept: string): ImageLibraryEntry | null {
    const candidates = Array.from(this.entries.values())
      .filter((e) => e.concept.toLowerCase() === concept.toLowerCase())
      .sort((a, b) => b.reuseCount - a.reuseCount);
    return candidates[0] || null;
  }

  incrementReuse(imageId: string): void {
    const entry = this.entries.get(imageId);
    if (entry) {
      entry.reuseCount++;
    }
  }

  size(): number {
    return this.entries.size;
  }
}

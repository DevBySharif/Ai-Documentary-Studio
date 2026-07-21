import type { VisualMetaphor } from "./types.js";

export class MetaphorLibrary {
  private metaphors: VisualMetaphor[];

  constructor(metaphors: VisualMetaphor[]) {
    this.metaphors = metaphors;
  }

  find(concept: string): VisualMetaphor | undefined {
    return this.metaphors.find(
      (m) => m.concept.toLowerCase() === concept.toLowerCase()
    );
  }

  findClosest(concept: string): VisualMetaphor | undefined {
    const exact = this.find(concept);
    if (exact) return exact;

    return this.metaphors.find((m) =>
      concept.toLowerCase().includes(m.concept.toLowerCase()) ||
      m.concept.toLowerCase().includes(concept.toLowerCase())
    );
  }

  getSymbol(concept: string): string | undefined {
    return this.find(concept)?.symbol;
  }

  getPreferredCamera(concept: string): string | undefined {
    return this.find(concept)?.cameraPreference;
  }

  getAnimation(concept: string): string | undefined {
    return this.find(concept)?.animationPreference;
  }

  getAllConcepts(): string[] {
    return this.metaphors.map((m) => m.concept);
  }

  add(metaphor: VisualMetaphor): void {
    const existing = this.find(metaphor.concept);
    if (existing) {
      Object.assign(existing, metaphor);
    } else {
      this.metaphors.push(metaphor);
    }
  }

  size(): number {
    return this.metaphors.length;
  }
}

import type { ReferenceBoardEntry } from "./types.js";

export class StyleReferenceBoard {
  private entries: ReferenceBoardEntry[] = [];

  add(entry: ReferenceBoardEntry): void {
    this.entries.push(entry);
  }

  addHeroCharacter(assetId: string, description: string): void {
    this.entries.push({ type: "hero_character", assetId, description, score: 100 });
  }

  addBackground(assetId: string, description: string): void {
    this.entries.push({ type: "background", assetId, description, score: 100 });
  }

  addLighting(assetId: string, description: string): void {
    this.entries.push({ type: "lighting", assetId, description, score: 100 });
  }

  addComposition(assetId: string, description: string): void {
    this.entries.push({ type: "composition", assetId, description, score: 100 });
  }

  addCamera(assetId: string, description: string): void {
    this.entries.push({ type: "camera", assetId, description, score: 100 });
  }

  addSymbol(symbol: string, assetId: string, description: string): void {
    this.entries.push({ type: "symbol", assetId, description, score: 100 });
  }

  addGoldStandard(assetId: string, description: string): void {
    this.entries.push({ type: "gold_standard", assetId, description, score: 100 });
  }

  getByType(type: ReferenceBoardEntry["type"]): ReferenceBoardEntry[] {
    return this.entries.filter((e) => e.type === type);
  }

  getHeroCharacters(): ReferenceBoardEntry[] {
    return this.getByType("hero_character");
  }

  getGoldStandards(): ReferenceBoardEntry[] {
    return this.getByType("gold_standard");
  }

  getBestReference(type: ReferenceBoardEntry["type"]): ReferenceBoardEntry | undefined {
    return this.entries
      .filter((e) => e.type === type)
      .sort((a, b) => b.score - a.score)[0];
  }

  getAll(): ReferenceBoardEntry[] {
    return [...this.entries];
  }

  count(): number {
    return this.entries.length;
  }
}

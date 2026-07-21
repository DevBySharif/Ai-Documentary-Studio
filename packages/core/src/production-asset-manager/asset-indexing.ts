import type { PAAssetMetadata } from "./types.js";

export class PAAssetIndexing {
  private assets: Map<string, PAAssetMetadata> = new Map();
  private tags: Map<string, Set<string>> = new Map();
  private providers: Map<string, Set<string>> = new Map();
  private characters: Map<string, Set<string>> = new Map();
  private fileNames: Map<string, string> = new Map();

  indexAsset(assetId: string): void {
    const asset = this.assets.get(assetId);
    if (!asset) return;
    if (!this.providers.has(asset.provider)) this.providers.set(asset.provider, new Set());
    this.providers.get(asset.provider)!.add(assetId);
  }

  registerAsset(metadata: PAAssetMetadata): void {
    this.assets.set(metadata.assetId, metadata);
  }

  tagAsset(assetId: string, tag: string): void {
    if (!this.tags.has(tag)) this.tags.set(tag, new Set());
    this.tags.get(tag)!.add(assetId);
  }

  registerCharacter(assetId: string, character: string): void {
    if (!this.characters.has(character)) this.characters.set(character, new Set());
    this.characters.get(character)!.add(assetId);
  }

  registerFileName(assetId: string, fileName: string): void {
    this.fileNames.set(assetId, fileName);
  }

  search(query: string): PAAssetMetadata[] {
    const q = query.toLowerCase();
    return Array.from(this.assets.values()).filter((a) =>
      a.assetId.toLowerCase().includes(q) || a.projectId.toLowerCase().includes(q)
    );
  }

  searchByTag(tag: string): PAAssetMetadata[] {
    const ids = this.tags.get(tag);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.assets.get(id)!).filter(Boolean);
  }

  searchByProvider(provider: string): PAAssetMetadata[] {
    const ids = this.providers.get(provider);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.assets.get(id)!).filter(Boolean);
  }

  searchByCharacter(character: string): PAAssetMetadata[] {
    const ids = this.characters.get(character);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.assets.get(id)!).filter(Boolean);
  }

  rebuildIndex(): void {
    this.tags.clear();
    this.providers.clear();
    this.characters.clear();
    for (const [assetId] of this.assets) {
      this.indexAsset(assetId);
    }
  }
}

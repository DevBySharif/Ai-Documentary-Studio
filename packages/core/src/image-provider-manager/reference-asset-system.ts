import { IPProviderName } from "./types";

export type IPReferenceType =
  | "character_sheet"
  | "environment_reference"
  | "color_palette"
  | "style_board"
  | "composition_example"
  | "thumbnail_reference";

export interface IPReferenceAsset {
  type: IPReferenceType;
  assetId: string;
  data: unknown;
  createdAt: number;
}

export class IPReferenceAssetSystem {
  private assets: Map<string, IPReferenceAsset> = new Map();

  addReference(type: IPReferenceType, assetId: string, data: unknown): void {
    this.assets.set(assetId, {
      type,
      assetId,
      data,
      createdAt: Date.now(),
    });
  }

  getReference(assetId: string): IPReferenceAsset | undefined {
    return this.assets.get(assetId);
  }

  getReferences(type: IPReferenceType): IPReferenceAsset[] {
    const results: IPReferenceAsset[] = [];
    for (const asset of this.assets.values()) {
      if (asset.type === type) {
        results.push(asset);
      }
    }
    return results;
  }

  getForProvider(provider: IPProviderName, referenceTypes: IPReferenceType[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const type of referenceTypes) {
      const refs = this.getReferences(type);
      if (refs.length > 0) {
        result[type] = refs.map((r) => r.data);
      }
    }
    return result;
  }

  removeReference(assetId: string): boolean {
    return this.assets.delete(assetId);
  }

  getAllAssets(): IPReferenceAsset[] {
    return Array.from(this.assets.values());
  }

  clear(): void {
    this.assets.clear();
  }

  count(): number {
    return this.assets.size;
  }
}

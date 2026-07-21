import type { MasterAssetRecord } from "./types.js";

export class MasterAssetDatabase {
  private assets = new Map<string, MasterAssetRecord>();

  store(asset: MasterAssetRecord): void {
    if (!asset?.id) throw new Error("MasterAssetRecord with id is required");
    asset.updatedAt = new Date().toISOString();
    this.assets.set(asset.id, asset);
  }

  get(id: string): MasterAssetRecord | undefined {
    return this.assets.get(id);
  }

  findByType(type: MasterAssetRecord["type"]): MasterAssetRecord[] {
    return Array.from(this.assets.values()).filter((a) => a.type === type);
  }

  findByTag(tag: string): MasterAssetRecord[] {
    if (!tag) return [];
    const lower = tag.toLowerCase();
    return Array.from(this.assets.values()).filter((a) =>
      a.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  delete(id: string): boolean {
    return this.assets.delete(id);
  }

  count(): number {
    return this.assets.size;
  }

  getAll(): MasterAssetRecord[] {
    return Array.from(this.assets.values());
  }

  search(query: string): MasterAssetRecord[] {
    if (!query) return [];
    const lower = query.toLowerCase();
    return Array.from(this.assets.values()).filter(
      (a) =>
        a.id.toLowerCase().includes(lower) ||
        a.tags.some((t) => t.toLowerCase().includes(lower)) ||
        JSON.stringify(a.metadata).toLowerCase().includes(lower)
    );
  }
}

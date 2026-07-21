export class AssetReferenceManager {
  private references = new Map<string, Set<string>>();

  addReference(assetId: string, referencedBy: string): void {
    if (!assetId || !referencedBy) return;
    if (!this.references.has(assetId)) this.references.set(assetId, new Set());
    this.references.get(assetId)!.add(referencedBy);
  }

  removeReference(assetId: string, referencedBy: string): void {
    this.references.get(assetId)?.delete(referencedBy);
  }

  getReferences(assetId: string): string[] {
    return Array.from(this.references.get(assetId) ?? []);
  }

  getReferenceCount(assetId: string): number {
    return this.references.get(assetId)?.size ?? 0;
  }

  isReferenced(assetId: string): boolean {
    return (this.references.get(assetId)?.size ?? 0) > 0;
  }

  getAllReferencedAssets(): string[] {
    const all = new Set<string>();
    for (const [assetId, refs] of this.references) {
      if (refs.size > 0) all.add(assetId);
    }
    return Array.from(all);
  }
}

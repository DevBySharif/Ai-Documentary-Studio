import type { PAAssetType } from "./types.js";

export class PASmartDeduplication {
  private duplicates: Map<string, string[]> = new Map();
  private references: Map<string, string> = new Map();
  private physicalCopies: Map<string, number> = new Map();

  findDuplicate(assetId: string, assetType: PAAssetType): string[] {
    return this.duplicates.get(assetId) ?? [];
  }

  registerDuplicate(assetId: string, duplicateAssetId: string): void {
    if (!this.duplicates.has(assetId)) this.duplicates.set(assetId, []);
    this.duplicates.get(assetId)!.push(duplicateAssetId);
  }

  registerReference(assetId: string, physicalCopyId: string): void {
    this.references.set(assetId, physicalCopyId);
    this.physicalCopies.set(physicalCopyId, (this.physicalCopies.get(physicalCopyId) ?? 0) + 1);
  }

  getPhysicalCopy(assetId: string): string | undefined {
    return this.references.get(assetId);
  }

  getReferenceCount(physicalCopyId: string): number {
    return this.physicalCopies.get(physicalCopyId) ?? 0;
  }

  mergeDuplicates(keepAssetId: string, removeAssetId: string): void {
    const removedPhysical = this.references.get(removeAssetId);
    const keepPhysical = this.references.get(keepAssetId);

    this.references.delete(removeAssetId);
    if (removedPhysical) {
      this.physicalCopies.set(removedPhysical, Math.max(0, (this.physicalCopies.get(removedPhysical) ?? 1) - 1));
    }
    if (keepPhysical) {
      this.physicalCopies.set(keepPhysical, (this.physicalCopies.get(keepPhysical) ?? 0) + 1);
    }
    this.duplicates.delete(removeAssetId);
  }
}

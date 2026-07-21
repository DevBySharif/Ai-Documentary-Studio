export class MPVersionControl {
  private versions: Map<string, number> = new Map();

  createVersion(assetType: string): string {
    const current = this.versions.get(assetType) ?? 0;
    const next = current + 1;
    this.versions.set(assetType, next);
    return `v${next}`;
  }

  getCurrentVersion(assetType: string): string {
    const current = this.versions.get(assetType) ?? 0;
    return `v${current}`;
  }

  getAllVersions(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [type, num] of this.versions) result[type] = `v${num}`;
    return result;
  }

  reset(): void {
    this.versions.clear();
  }
}

export class StorageLayerManager {
  private storageRoot: string;

  constructor(rootPath: string) {
    this.storageRoot = rootPath;
  }

  getRoot(): string {
    return this.storageRoot;
  }

  resolvePath(assetId: string, subdirectory = "assets"): string {
    return `${this.storageRoot}/${subdirectory}/${assetId}`;
  }

  getStorageInfo(): { root: string; available: boolean } {
    return { root: this.storageRoot, available: true };
  }
}

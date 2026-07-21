import type { WMStorageInfo } from "./types.js";

export class WMStorageManagement {
  private info: WMStorageInfo = { workspaceSize: 0, cacheUsage: 0, exportSize: 0, assetSize: 0, archiveSize: 0 };

  update(info: Partial<WMStorageInfo>): void {
    this.info = { ...this.info, ...info };
  }

  getInfo(): WMStorageInfo {
    return { ...this.info };
  }

  getTotalSize(): number {
    return this.info.workspaceSize + this.info.cacheUsage + this.info.exportSize + this.info.assetSize + this.info.archiveSize;
  }

  cleanupCache(): void {
    this.info.cacheUsage = 0;
  }
}

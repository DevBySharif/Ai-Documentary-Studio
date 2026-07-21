export type StorageDriverType = "LocalDisk" | "NetworkDrive" | "CloudS3";

/**
 * Storage Abstraction Provider (Vol 06 Part 04 - Section 18).
 * Abstract driver interface decoupling internal modules from physical storage media (Local disk, network drive, cloud).
 */
export class StorageAbstractionProvider {
  private activeDriver: StorageDriverType = "LocalDisk";

  public setDriver(driver: StorageDriverType): void {
    this.activeDriver = driver;
  }

  public getActiveDriver(): StorageDriverType {
    return this.activeDriver;
  }

  public readBytes(virtualPath: string): { path: string; bytesLength: number } {
    return {
      path: virtualPath,
      bytesLength: 1024,
    };
  }

  public writeBytes(virtualPath: string, bytesLength: number): { success: boolean; bytesWritten: number } {
    return {
      success: true,
      bytesWritten: bytesLength,
    };
  }
}

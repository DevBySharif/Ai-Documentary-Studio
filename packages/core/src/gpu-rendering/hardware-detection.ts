import type { GRHardwareProfile, GRGPUVendor, GRHardwareEncoder } from "./types.js";

export class GRHardwareDetection {
  detect(): GRHardwareProfile {
    return {
      vendor: this.detectVendor(),
      vramMB: this.detectVRAM(),
      cpuCores: this.detectCPUCores(),
      ramMB: this.detectRAM(),
      encoder: this.detectEncoder(),
      os: this.detectOS(),
      supportsHardwareEncoding: this.supportsHardwareEncoding()
    };
  }

  private detectVendor(): GRGPUVendor {
    return "nvidia";
  }

  private detectVRAM(): number {
    return 8192;
  }

  private detectCPUCores(): number {
    return navigator.hardwareConcurrency ?? 4;
  }

  private detectRAM(): number {
    return 16384;
  }

  private detectEncoder(): GRHardwareEncoder {
    const vendor = this.detectVendor();
    switch (vendor) {
      case "nvidia": return "nvenc";
      case "amd": return "amf";
      case "intel": return "qsv";
      case "apple": return "videotoolbox";
      default: return "software";
    }
  }

  private detectOS(): string {
    return "windows";
  }

  private supportsHardwareEncoding(): boolean {
    return this.detectEncoder() !== "software";
  }

  getOptimalResolution(profile: GRHardwareProfile): string {
    if (profile.vramMB >= 8192) return "3840x2160";
    if (profile.vramMB >= 4096) return "1920x1080";
    return "1280x720";
  }
}

import type { GRHardwareProfile } from "./types.js";

export class GRPerformanceOptimizer {
  optimize(profile: GRHardwareProfile): { cacheSizeMB: number; effectQuality: string; parallelFrames: number; simplifyEffects: boolean } {
    if (profile.vramMB < 4096) {
      return { cacheSizeMB: 128, effectQuality: "low", parallelFrames: 1, simplifyEffects: true };
    }

    if (profile.vramMB < 8192) {
      return { cacheSizeMB: 256, effectQuality: "medium", parallelFrames: 2, simplifyEffects: false };
    }

    return { cacheSizeMB: 512, effectQuality: "high", parallelFrames: 4, simplifyEffects: false };
  }

  autoTune(profile: GRHardwareProfile, renderTimeMs: number): string[] {
    const adjustments: string[] = [];
    if (renderTimeMs > 3600000 && profile.vramMB >= 8192) adjustments.push("Enable parallel frame rendering");
    if (profile.vramMB < 4096) adjustments.push("Reduce texture cache to 128MB");
    if (profile.cpuCores >= 8) adjustments.push("Enable multi-threaded encoding");
    return adjustments;
  }
}

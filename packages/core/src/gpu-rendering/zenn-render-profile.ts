import type { GRZennProfile } from "./types.js";

export class GRZennRenderProfile {
  private profile: GRZennProfile = {
    accelerated: true,
    scaling: "high_quality",
    subtitleAccuracy: "accurate",
    motionInterpolation: "smooth",
    framePacing: "stable",
    colorManagement: "consistent",
    textureStreaming: "efficient"
  };

  getProfile(): GRZennProfile {
    return { ...this.profile };
  }

  getTextureCacheSize(): number {
    return 384;
  }

  getEffectQuality(): string {
    return "high";
  }

  useHardwareEncoding(): boolean {
    return this.profile.accelerated;
  }

  getParallelFrames(): number {
    return 2;
  }

  isHighQuality(): boolean {
    return this.profile.scaling === "high_quality";
  }
}

import type { EEResolution } from "./types.js";

export class EEResolutionProfiles {
  private readonly resolutions: Record<EEResolution, { width: number; height: number }> = {
    "720p": { width: 1280, height: 720 },
    "1080p": { width: 1920, height: 1080 },
    "1440p": { width: 2560, height: 1440 },
    "4k": { width: 3840, height: 2160 },
    "8k": { width: 7680, height: 4320 }
  };

  getResolution(resolution: EEResolution): { width: number; height: number } {
    return { ...this.resolutions[resolution] };
  }

  isSupported(resolution: EEResolution): boolean {
    return resolution in this.resolutions;
  }

  getResolutions(): EEResolution[] {
    return Object.keys(this.resolutions) as EEResolution[];
  }
}

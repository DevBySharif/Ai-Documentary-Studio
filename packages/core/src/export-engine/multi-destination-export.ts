import type { EEPlatform, EEPlatformPreset } from "./types.js";
import { EEPlatformPresets } from "./platform-presets.js";

export class EEMultiDestinationExport {
  private presets: EEPlatformPresets;

  constructor() {
    this.presets = new EEPlatformPresets();
  }

  exportAll(platforms: EEPlatform[]): Array<{ platform: EEPlatform; preset: EEPlatformPreset; output: string }> {
    return platforms.map((p) => ({
      platform: p,
      preset: this.presets.getPreset(p),
      output: `export_${p}_${Date.now()}.${this.presets.getPreset(p).format}`
    }));
  }

  getCommonPlatforms(): EEPlatform[] {
    return ["youtube_long", "youtube_shorts", "instagram_reels", "tiktok", "archive_master"];
  }
}

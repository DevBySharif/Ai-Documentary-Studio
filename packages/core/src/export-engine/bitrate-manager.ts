import type { EEBitrateMode, EEPlatform } from "./types.js";

export class EEBitrateManager {
  recommend(platform: EEPlatform): { mode: EEBitrateMode; videoBitrate: string; audioBitrate: string } {
    const map: Record<EEPlatform, { mode: EEBitrateMode; videoBitrate: string; audioBitrate: string }> = {
      youtube_long: { mode: "vbr", videoBitrate: "16M", audioBitrate: "192k" },
      youtube_shorts: { mode: "vbr", videoBitrate: "12M", audioBitrate: "128k" },
      instagram_reels: { mode: "vbr", videoBitrate: "8M", audioBitrate: "128k" },
      tiktok: { mode: "vbr", videoBitrate: "6M", audioBitrate: "128k" },
      facebook_video: { mode: "vbr", videoBitrate: "10M", audioBitrate: "128k" },
      x_twitter: { mode: "vbr", videoBitrate: "5M", audioBitrate: "128k" },
      archive_master: { mode: "cq", videoBitrate: "lossless", audioBitrate: "lossless" }
    };
    return map[platform];
  }

  getModeName(mode: EEBitrateMode): string {
    const names: Record<EEBitrateMode, string> = { cbr: "Constant Bitrate", vbr: "Variable Bitrate", cq: "Constant Quality" };
    return names[mode];
  }
}

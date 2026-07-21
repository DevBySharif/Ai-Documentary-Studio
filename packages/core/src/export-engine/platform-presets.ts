import type { EEPlatformPreset, EEPlatform, EEFormat, EEVideoCodec, EEAudioCodec, EEResolution, EEFramerate, EEBitrateMode } from "./types.js";

export class EEPlatformPresets {
  private readonly presets: Record<EEPlatform, EEPlatformPreset> = {
    youtube_long: { platform: "youtube_long", format: "mp4", videoCodec: "h264", audioCodec: "aac", resolution: "1080p", framerate: 30, bitrateMode: "vbr", videoBitrate: "16M", audioBitrate: "192k" },
    youtube_shorts: { platform: "youtube_shorts", format: "mp4", videoCodec: "h264", audioCodec: "aac", resolution: "1080p", framerate: 30, bitrateMode: "vbr", videoBitrate: "12M", audioBitrate: "128k" },
    instagram_reels: { platform: "instagram_reels", format: "mp4", videoCodec: "h264", audioCodec: "aac", resolution: "1080p", framerate: 30, bitrateMode: "vbr", videoBitrate: "8M", audioBitrate: "128k" },
    tiktok: { platform: "tiktok", format: "mp4", videoCodec: "h264", audioCodec: "aac", resolution: "1080p", framerate: 30, bitrateMode: "vbr", videoBitrate: "6M", audioBitrate: "128k" },
    facebook_video: { platform: "facebook_video", format: "mp4", videoCodec: "h264", audioCodec: "aac", resolution: "1080p", framerate: 30, bitrateMode: "vbr", videoBitrate: "10M", audioBitrate: "128k" },
    x_twitter: { platform: "x_twitter", format: "mp4", videoCodec: "h264", audioCodec: "aac", resolution: "720p", framerate: 30, bitrateMode: "vbr", videoBitrate: "5M", audioBitrate: "128k" },
    archive_master: { platform: "archive_master", format: "mkv", videoCodec: "h265", audioCodec: "flac", resolution: "4k", framerate: 30, bitrateMode: "cq", videoBitrate: "lossless", audioBitrate: "lossless" }
  };

  getPreset(platform: EEPlatform): EEPlatformPreset {
    return { ...this.presets[platform] };
  }

  getAllPresets(): EEPlatformPreset[] {
    return Object.values(this.presets).map((p) => ({ ...p }));
  }

  getSupportedPlatforms(): EEPlatform[] {
    return Object.keys(this.presets) as EEPlatform[];
  }
}

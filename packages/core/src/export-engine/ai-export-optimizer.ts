import type { EEAIExportDecision, EEVideoCodec, EEPlatform } from "./types.js";

export class EEAIExportOptimizer {
  analyze(platform: EEPlatform, resolution: string, durationMs: number, complexity: number): EEAIExportDecision {
    const isMobile = ["instagram_reels", "tiktok", "youtube_shorts"].includes(platform);
    const isArchive = platform === "archive_master";

    let bitrate: string;
    let codec: EEVideoCodec;
    let speed: string;
    let efficiency: number;

    if (isArchive) {
      bitrate = "lossless"; codec = "h265"; speed = "slow"; efficiency = 1;
    } else if (isMobile) {
      bitrate = "8M"; codec = "h264"; speed = "medium"; efficiency = 0.8;
    } else {
      bitrate = "16M"; codec = "h264"; speed = "medium"; efficiency = 0.85;
    }

    const resolutionFactor = resolution === "4k" ? 4 : resolution === "1080p" ? 1 : 0.5;
    const uploadSize = Math.round((parseInt(bitrate) * durationMs / 1000) / 8 * resolutionFactor);
    const visualQuality = complexity > 0.7 ? 90 : 95;

    return { recommendedBitrate: bitrate, recommendedCodec: codec, encodingSpeed: speed, compressionEfficiency: efficiency, uploadSize, visualQuality };
  }
}

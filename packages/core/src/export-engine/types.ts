export type EEFormat = "mp4" | "mov" | "mkv" | "webm" | "image_sequence";

export type EEVideoCodec = "h264" | "h265" | "av1" | "prores" | "dnxhr";

export type EEAudioCodec = "aac" | "opus" | "pcm" | "flac";

export type EEResolution = "720p" | "1080p" | "1440p" | "4k" | "8k";

export type EEFramerate = 24 | 25 | 30 | 50 | 60;

export type EEBitrateMode = "cbr" | "vbr" | "cq";

export type EEPlatform =
  | "youtube_long" | "youtube_shorts" | "instagram_reels"
  | "tiktok" | "facebook_video" | "x_twitter" | "archive_master";

export type EEThumbnailFormat = "png" | "jpg" | "webp";

export interface EEPlatformPreset {
  platform: EEPlatform;
  format: EEFormat;
  videoCodec: EEVideoCodec;
  audioCodec: EEAudioCodec;
  resolution: EEResolution;
  framerate: EEFramerate;
  bitrateMode: EEBitrateMode;
  videoBitrate: string;
  audioBitrate: string;
}

export interface EEMetadata {
  title: string;
  author: string;
  copyright: string;
  description: string;
  language: string;
  creationDate: string;
  productionVersion: string;
  channelDnaVersion: string;
}

export interface EEArchivePackage {
  timeline: boolean;
  assets: boolean;
  audio: boolean;
  subtitles: boolean;
  motionData: boolean;
  exportSettings: boolean;
  qaReport: boolean;
}

export interface EEManifest {
  productionId: string;
  exportVersion: string;
  codec: string;
  resolution: string;
  duration: number;
  qaScore: number;
  fileChecksums: Record<string, string>;
  assetReferences: string[];
}

export interface EEDeliveryPackage {
  video: string;
  thumbnails: string[];
  subtitleFiles: string[];
  metadata: EEMetadata;
  qaReport: string;
  certificate: string;
  archiveProject: string;
}

export interface EEVersionEntry {
  version: string;
  date: string;
  platform: EEPlatform;
  checksum: string;
  status: "draft" | "final" | "published";
}

export interface EEAIExportDecision {
  recommendedBitrate: string;
  recommendedCodec: EEVideoCodec;
  encodingSpeed: string;
  compressionEfficiency: number;
  uploadSize: number;
  visualQuality: number;
}

export interface EEOutputContract {
  format: string;
  codec: string;
  resolution: string;
  fps: number;
  platform: string;
  status: string;
}

export interface EEValidationResult {
  videoStream: boolean;
  audioStream: boolean;
  subtitlePackage: boolean;
  metadata: boolean;
  codecSupport: boolean;
  containerIntegrity: boolean;
  passed: boolean;
}

export interface EEZennProfile {
  format: string;
  codec: string;
  resolution: string;
  fps: number;
  bitrate: string;
  audio: string;
  metadata: string;
  archive: boolean;
}

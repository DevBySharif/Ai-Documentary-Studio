import type { MasterRenderPackage, ExportConfig, ExportProfile, RenderManifest, RenderQuality } from "./types.js";

export class ExportManager {
  private profiles: Record<ExportProfile, ExportConfig> = {
    youtube_1080p: {
      profile: "youtube_1080p",
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      bitrate: "12M",
      codec: "h264",
    },
    youtube_shorts: {
      profile: "youtube_shorts",
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      bitrate: "8M",
      codec: "h264",
    },
    tiktok: {
      profile: "tiktok",
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      bitrate: "6M",
      codec: "h264",
    },
    instagram_reels: {
      profile: "instagram_reels",
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      bitrate: "8M",
      codec: "h264",
    },
    "4k_documentary": {
      profile: "4k_documentary",
      resolution: { width: 3840, height: 2160 },
      fps: 24,
      bitrate: "50M",
      codec: "h265",
    },
    archive_master: {
      profile: "archive_master",
      resolution: { width: 3840, height: 2160 },
      fps: 60,
      bitrate: "100M",
      codec: "h265",
    },
  };

  getConfig(profile: ExportProfile): ExportConfig {
    return this.profiles[profile];
  }

  generateManifest(pkg: MasterRenderPackage, profile: ExportProfile): RenderManifest {
    const config = this.profiles[profile];
    const images = new Set(pkg.timeline.map((e) => e.data?.image_id as string).filter(Boolean));
    const motionEvents = pkg.timeline.filter((e) => e.layer === "motion");

    return {
      project: (pkg.projectManifest?.name as string) ?? "untitled",
      runtime: pkg.timeline.length > 0 ? pkg.timeline[pkg.timeline.length - 1].end : 0,
      fps: config.fps,
      sceneCount: new Set(pkg.timeline.map((e) => e.data?.scene as number)).size,
      segments: pkg.timeline.length,
      images: images.size,
      reuseRate: pkg.timeline.length > 0
        ? Math.round((1 - images.size / Math.max(1, pkg.timeline.length)) * 100)
        : 0,
      motionEvents: motionEvents.length,
      subtitleBlocks: pkg.subtitles.length,
      qualityScore: this.calculateQualityScore(pkg),
    };
  }

  setQuality(renderPackage: MasterRenderPackage, quality: RenderQuality): MasterRenderPackage {
    return {
      ...renderPackage,
      projectManifest: {
        ...renderPackage.projectManifest,
        renderQuality: quality,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private calculateQualityScore(pkg: MasterRenderPackage): number {
    let score = 100;

    if (pkg.timeline.length === 0) score -= 30;
    if (!pkg.voice) score -= 15;
    if (pkg.subtitles.length === 0) score -= 10;
    if (pkg.timeline.some((e) => e.duration < 0.5)) score -= 10;
    if (!pkg.sealed) score -= 5;

    return Math.max(0, score);
  }
}

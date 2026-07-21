import type { GRVideoMuxConfig } from "./types.js";

export class GRVideoMuxer {
  private config: GRVideoMuxConfig = {
    videoCodec: "h264",
    audioCodec: "aac",
    container: "mp4",
    includeSubtitles: false,
    includeChapters: false
  };

  configure(config: Partial<GRVideoMuxConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): GRVideoMuxConfig {
    return { ...this.config };
  }

  mux(videoPath: string, audioPath: string, subtitlePath?: string): string {
    const outputName = `final_${Date.now()}.${this.config.container}`;
    return outputName;
  }

  addAudio(videoPath: string, audioPath: string): string {
    return `muxed_audio_${videoPath}`;
  }

  addSubtitles(videoPath: string, subtitlePath: string): string {
    if (!this.config.includeSubtitles) return videoPath;
    return `subbed_${videoPath}`;
  }

  addChapters(videoPath: string, chapters: Array<{ title: string; timeMs: number }>): string {
    if (!this.config.includeChapters) return videoPath;
    return `chaptered_${videoPath}`;
  }

  getOutputExtension(): string {
    return this.config.container;
  }
}

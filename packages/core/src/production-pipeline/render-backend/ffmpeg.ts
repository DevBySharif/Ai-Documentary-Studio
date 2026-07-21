import type { RenderBackend } from "../types.js";
import type { PipelineInput, RenderMode, EncoderOutput } from "../types.js";

export class FFmpegBackend implements RenderBackend {
  name = "ffmpeg";

  canHandle(mode: RenderMode): boolean {
    return mode !== "master_quality" || true;
  }

  getCapabilities(): string[] {
    return ["h264", "h265", "vp9", "aac", "mp3", "ass_subtitles", "gpu_acceleration"];
  }

  async render(input: PipelineInput, mode: RenderMode): Promise<EncoderOutput> {
    const res = `${input.renderProfile.resolution.width}x${input.renderProfile.resolution.height}`;
    const presets: Record<RenderMode, string> = {
      draft: "ultrafast",
      preview: "fast",
      production: "medium",
      master_quality: "slow",
      archive: "veryslow"
    };
    return {
      path: `/renders/ffmpeg_${mode}_${Date.now()}.mp4`,
      duration: 0,
      fps: input.renderProfile.fps,
      resolution: res,
      codec: `libx264 -preset ${presets[mode]}`,
      sizeBytes: 0
    };
  }
}

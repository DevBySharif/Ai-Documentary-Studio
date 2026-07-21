import type { EncoderOutput, RenderProfile, RenderMode } from "../types.js";

export class Encoder {
  async encode(frames: Array<unknown>, profile: RenderProfile, totalDuration: number): Promise<EncoderOutput> {
    const res = `${profile.resolution.width}x${profile.resolution.height}`;
    return {
      path: `/renders/output_${Date.now()}.mp4`,
      duration: totalDuration,
      fps: profile.fps,
      resolution: res,
      codec: profile.codec,
      sizeBytes: Math.round(totalDuration * profile.fps * 50000)
    };
  }

  getEncoderForMode(mode: RenderMode): string {
    const encoders: Record<RenderMode, string> = {
      draft: "libx264 -preset ultrafast",
      preview: "libx264 -preset fast",
      production: "libx264 -preset medium",
      master_quality: "libx264 -preset slow",
      archive: "libx264 -preset veryslow"
    };
    return encoders[mode];
  }
}

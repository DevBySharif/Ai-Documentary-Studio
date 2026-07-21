import type { RenderBackend } from "../types.js";
import type { PipelineInput, RenderMode, EncoderOutput } from "../types.js";

export class RemotionBackend implements RenderBackend {
  name = "remotion";

  canHandle(mode: RenderMode): boolean {
    return mode === "production" || mode === "preview";
  }

  getCapabilities(): string[] {
    return ["react_components", "css_animations", "svg", "canvas", "server_side"];
  }

  async render(input: PipelineInput, mode: RenderMode): Promise<EncoderOutput> {
    return {
      path: `/renders/remotion_${mode}_${Date.now()}.mp4`,
      duration: 0,
      fps: input.renderProfile.fps,
      resolution: `${input.renderProfile.resolution.width}x${input.renderProfile.resolution.height}`,
      codec: "h264",
      sizeBytes: 0
    };
  }
}

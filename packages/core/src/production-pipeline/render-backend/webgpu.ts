import type { RenderBackend } from "../types.js";
import type { PipelineInput, RenderMode, EncoderOutput } from "../types.js";

export class WebGPUBackend implements RenderBackend {
  name = "webgpu";

  canHandle(mode: RenderMode): boolean {
    return mode === "draft" || mode === "preview";
  }

  getCapabilities(): string[] {
    return ["gpu_compute", "shader_effects", "parallel_encoding", "tile_rendering"];
  }

  async render(input: PipelineInput, mode: RenderMode): Promise<EncoderOutput> {
    return {
      path: `/renders/webgpu_${mode}_${Date.now()}.mp4`,
      duration: 0,
      fps: input.renderProfile.fps,
      resolution: `${input.renderProfile.resolution.width}x${input.renderProfile.resolution.height}`,
      codec: "h264_gpu",
      sizeBytes: 0
    };
  }
}

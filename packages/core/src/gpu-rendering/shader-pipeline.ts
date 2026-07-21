import type { GRShaderType, GRShaderConfig } from "./types.js";

export class GRShaderPipeline {
  private shaders: Map<GRShaderType, GRShaderConfig> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.shaders.set("blur", { type: "blur", source: "gaussian_blur.wgsl", reusable: true });
    this.shaders.set("glow", { type: "glow", source: "glow_effect.wgsl", reusable: true });
    this.shaders.set("depth", { type: "depth", source: "depth_map.wgsl", reusable: true });
    this.shaders.set("grain", { type: "grain", source: "film_grain.wgsl", reusable: true });
    this.shaders.set("subtitle", { type: "subtitle", source: "subtitle_render.wgsl", reusable: true });
    this.shaders.set("transition", { type: "transition", source: "transition_blend.wgsl", reusable: true });
  }

  getShader(type: GRShaderType): GRShaderConfig | undefined {
    const s = this.shaders.get(type);
    return s ? { ...s } : undefined;
  }

  registerShader(config: GRShaderConfig): void {
    this.shaders.set(config.type, config);
  }

  getReusableShaders(): GRShaderConfig[] {
    return Array.from(this.shaders.values()).filter((s) => s.reusable).map((s) => ({ ...s }));
  }

  clear(): void {
    this.shaders.clear();
  }
}

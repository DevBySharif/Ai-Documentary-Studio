import type { GRRenderBackend, GRHardwareProfile } from "./types.js";

export interface GRBackendAPI {
  name: GRRenderBackend;
  initialize(profile: GRHardwareProfile): boolean;
  renderFrame(frame: number): boolean;
  finalize(): string;
  isAvailable(): boolean;
  getSupportedEncoders(): string[];
}

export class GRFFmpegBackend implements GRBackendAPI {
  name: GRRenderBackend = "ffmpeg";
  private initialized = false;

  initialize(_profile: GRHardwareProfile): boolean {
    this.initialized = true;
    return true;
  }

  renderFrame(_frame: number): boolean {
    return this.initialized;
  }

  finalize(): string {
    return "ffmpeg_output.mp4";
  }

  isAvailable(): boolean {
    return true;
  }

  getSupportedEncoders(): string[] {
    return ["nvenc", "qsv", "amf", "software"];
  }
}

export class GRRemotionBackend implements GRBackendAPI {
  name: GRRenderBackend = "remotion";
  private initialized = false;

  initialize(_profile: GRHardwareProfile): boolean {
    this.initialized = true;
    return true;
  }

  renderFrame(_frame: number): boolean {
    return this.initialized;
  }

  finalize(): string {
    return "remotion_output.mp4";
  }

  isAvailable(): boolean {
    return true;
  }

  getSupportedEncoders(): string[] {
    return ["software"];
  }
}

export class GRWebGPUBackend implements GRBackendAPI {
  name: GRRenderBackend = "webgpu";
  private initialized = false;

  initialize(_profile: GRHardwareProfile): boolean {
    this.initialized = true;
    return true;
  }

  renderFrame(_frame: number): boolean {
    return this.initialized;
  }

  finalize(): string {
    return "webgpu_output.mp4";
  }

  isAvailable(): boolean {
    return typeof navigator !== "undefined" && "gpu" in navigator;
  }

  getSupportedEncoders(): string[] {
    return ["software", "videotoolbox"];
  }
}

export class GROpenGLBackend implements GRBackendAPI {
  name: GRRenderBackend = "opengl";
  private initialized = false;

  initialize(_profile: GRHardwareProfile): boolean {
    this.initialized = true;
    return true;
  }

  renderFrame(_frame: number): boolean {
    return this.initialized;
  }

  finalize(): string {
    return "opengl_output.mp4";
  }

  isAvailable(): boolean {
    return true;
  }

  getSupportedEncoders(): string[] {
    return ["software", "nvenc", "amf"];
  }
}

export class GRVulkanBackend implements GRBackendAPI {
  name: GRRenderBackend = "vulkan";
  private initialized = false;

  initialize(_profile: GRHardwareProfile): boolean {
    this.initialized = true;
    return true;
  }

  renderFrame(_frame: number): boolean {
    return this.initialized;
  }

  finalize(): string {
    return "vulkan_output.mp4";
  }

  isAvailable(): boolean {
    return false;
  }

  getSupportedEncoders(): string[] {
    return ["software", "nvenc", "amf"];
  }
}

export class GRRenderBackendManager {
  private backends: Map<GRRenderBackend, GRBackendAPI> = new Map();
  private active: GRRenderBackend | null = null;

  constructor() {
    this.register(new GRFFmpegBackend());
    this.register(new GRRemotionBackend());
    this.register(new GRWebGPUBackend());
    this.register(new GROpenGLBackend());
    this.register(new GRVulkanBackend());
  }

  register(backend: GRBackendAPI): void {
    this.backends.set(backend.name, backend);
  }

  select(name: GRRenderBackend, profile: GRHardwareProfile): boolean {
    const backend = this.backends.get(name);
    if (!backend || !backend.isAvailable()) return false;
    if (!backend.initialize(profile)) return false;
    this.active = name;
    return true;
  }

  getActive(): GRBackendAPI | undefined {
    return this.active ? this.backends.get(this.active) : undefined;
  }

  getAvailableBackends(): GRRenderBackend[] {
    return Array.from(this.backends.values()).filter((b) => b.isAvailable()).map((b) => b.name);
  }

  autoSelect(profile: GRHardwareProfile): GRRenderBackend {
    if (profile.supportsHardwareEncoding) {
      if (this.backends.get("ffmpeg")?.isAvailable()) return "ffmpeg";
    }
    if (this.backends.get("webgpu")?.isAvailable()) return "webgpu";
    return "opengl";
  }
}

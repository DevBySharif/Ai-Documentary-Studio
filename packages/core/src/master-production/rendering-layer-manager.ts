import type { MPRenderingComponent } from "./types.js";

export class MPRenderingLayerManager {
  private readonly components: MPRenderingComponent[] = [
    "scene_renderer", "motion_renderer", "effects_engine",
    "subtitle_engine", "audio_mixer", "frame_scheduler", "gpu_renderer"
  ];

  getComponents(): MPRenderingComponent[] {
    return [...this.components];
  }

  isRenderingComponent(component: string): component is MPRenderingComponent {
    return this.components.includes(component as MPRenderingComponent);
  }

  generatesCreativeContent(): boolean {
    return false;
  }
}

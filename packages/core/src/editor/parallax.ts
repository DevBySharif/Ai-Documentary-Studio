import type { ParallaxConfig, MotionType } from "./types.js";

export class ParallaxEngine {
  private config: ParallaxConfig;

  constructor(config: ParallaxConfig) {
    this.config = config;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getLayerSpeeds(): { foreground: number; middle: number; background: number } {
    return {
      foreground: this.config.foregroundSpeed,
      middle: this.config.middleSpeed,
      background: this.config.backgroundSpeed,
    };
  }

  applyDepth(depthAvailable: boolean): MotionType | null {
    if (!this.config.enabled || !depthAvailable) return null;
    return "parallax";
  }

  getSubtlety(): number {
    return this.config.subtlety;
  }
}

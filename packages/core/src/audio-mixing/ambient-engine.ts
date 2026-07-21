import type { AMAmbientConfig, AMAmbientType } from "./types.js";

export class AMAmbientEngine {
  private presets: Record<AMAmbientType, AMAmbientConfig> = {
    room_tone: { type: "room_tone", volume: -20, fadeIn: 500, fadeOut: 500 },
    wind: { type: "wind", volume: -18, fadeIn: 1000, fadeOut: 1000 },
    rain: { type: "rain", volume: -16, fadeIn: 800, fadeOut: 800 },
    forest: { type: "forest", volume: -14, fadeIn: 600, fadeOut: 600 },
    city: { type: "city", volume: -12, fadeIn: 400, fadeOut: 400 },
    space: { type: "space", volume: -22, fadeIn: 2000, fadeOut: 2000 },
    ocean: { type: "ocean", volume: -15, fadeIn: 1000, fadeOut: 1000 }
  };

  private active: AMAmbientConfig | null = null;

  getPreset(type: AMAmbientType): AMAmbientConfig {
    return { ...this.presets[type] };
  }

  setActive(config: AMAmbientConfig): void {
    this.active = { ...config };
  }

  setActiveByType(type: AMAmbientType): void {
    this.active = this.getPreset(type);
  }

  getActive(): AMAmbientConfig | null {
    return this.active ? { ...this.active } : null;
  }

  clearActive(): void {
    this.active = null;
  }

  adjustForNarration(ambientVolume: number, isSpeaking: boolean): number {
    if (!this.active) return ambientVolume;
    return isSpeaking ? ambientVolume - 3 : ambientVolume;
  }
}

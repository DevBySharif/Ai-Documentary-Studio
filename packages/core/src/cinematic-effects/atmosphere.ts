import type { CEAtmosphereConfig, CEAtmosphereType } from "./types.js";

export class CEAtmosphereEngine {
  apply(pixel: { r: number; g: number; b: number }, config: CEAtmosphereConfig, frame: number): { r: number; g: number; b: number } {
    const noise = Math.sin(frame * config.speed * 0.01) * 0.5 + 0.5;
    const intensity = config.intensity * noise;

    switch (config.type) {
      case "fog":
        return this.blend(pixel, { r: 0.9, g: 0.92, b: 0.95 }, intensity * 0.5);
      case "mist":
        return this.blend(pixel, { r: 0.85, g: 0.88, b: 0.92 }, intensity * 0.3);
      case "dust":
        return this.blend(pixel, { r: 0.8, g: 0.75, b: 0.7 }, intensity * 0.2);
      case "smoke":
        return this.blend(pixel, { r: 0.7, g: 0.7, b: 0.7 }, intensity * 0.4);
      case "floating_particles":
        return pixel;
      default:
        return pixel;
    }
  }

  private blend(base: { r: number; g: number; b: number }, color: { r: number; g: number; b: number }, amount: number): { r: number; g: number; b: number } {
    return {
      r: base.r * (1 - amount) + color.r * amount,
      g: base.g * (1 - amount) + color.g * amount,
      b: base.b * (1 - amount) + color.b * amount
    };
  }

  getDefaultConfig(type: CEAtmosphereType): CEAtmosphereConfig {
    return { type, intensity: 0.1, speed: 1 };
  }
}

import type { CEExposureConfig } from "./types.js";

export class CEExposureEngine {
  apply(pixel: { r: number; g: number; b: number }, config: CEExposureConfig): { r: number; g: number; b: number } {
    const adjust = (channel: number, highlights: number, midtones: number, shadows: number): number => {
      if (channel > 0.7) return channel + highlights * 0.1;
      if (channel > 0.3) return channel + midtones * 0.1;
      return channel + shadows * 0.1;
    };

    let r = adjust(pixel.r, config.highlights, config.midtones, config.shadows);
    let g = adjust(pixel.g, config.highlights, config.midtones, config.shadows);
    let b = adjust(pixel.b, config.highlights, config.midtones, config.shadows);

    r = Math.max(config.blackPoint, Math.min(config.whitePoint, r));
    g = Math.max(config.blackPoint, Math.min(config.whitePoint, g));
    b = Math.max(config.blackPoint, Math.min(config.whitePoint, b));

    return { r, g, b };
  }

  detectClipping(pixel: { r: number; g: number; b: number }): boolean {
    return pixel.r >= 0.99 || pixel.g >= 0.99 || pixel.b >= 0.99;
  }
}

export class CEBloomEngine {
  apply(pixel: { r: number; g: number; b: number }, intensity: number): { r: number; g: number; b: number } {
    const luminance = 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
    if (luminance > 0.7) {
      const bloomAmount = (luminance - 0.7) / 0.3 * intensity;
      return {
        r: Math.min(1, pixel.r + bloomAmount * 0.5),
        g: Math.min(1, pixel.g + bloomAmount * 0.3),
        b: Math.min(1, pixel.b + bloomAmount * 0.2)
      };
    }
    return pixel;
  }
}

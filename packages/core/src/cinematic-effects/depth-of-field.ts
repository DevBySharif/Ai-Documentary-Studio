export class CEDepthOfFieldEngine {
  apply(pixel: { r: number; g: number; b: number }, depthValue: number, focalDepth: number, blurAmount: number): { r: number; g: number; b: number } {
    const depthDiff = Math.abs(depthValue - focalDepth);
    const blurFactor = depthDiff * blurAmount * 2;

    if (blurFactor > 0.5) {
      const blend = Math.min(1, blurFactor);
      return {
        r: pixel.r * (1 - blend * 0.3) + 0.5 * blend * 0.3,
        g: pixel.g * (1 - blend * 0.3) + 0.5 * blend * 0.3,
        b: pixel.b * (1 - blend * 0.3) + 0.5 * blend * 0.3
      };
    }
    return pixel;
  }
}

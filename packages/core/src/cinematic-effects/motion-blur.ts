export class CEMotionBlurEngine {
  apply(pixel: { r: number; g: number; b: number }, velocityX: number, velocityY: number, intensity: number): { r: number; g: number; b: number } {
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const blurAmount = Math.min(1, speed * intensity * 0.1);

    if (blurAmount < 0.01) return pixel;

    const blend = 1 - blurAmount * 0.5;
    return {
      r: pixel.r * blend + 0.5 * (1 - blend),
      g: pixel.g * blend + 0.5 * (1 - blend),
      b: pixel.b * blend + 0.5 * (1 - blend)
    };
  }
}

export class CELightRaysEngine {
  apply(pixel: { r: number; g: number; b: number }, x: number, y: number, lightSourceX: number, lightSourceY: number, intensity: number): { r: number; g: number; b: number } {
    if (intensity <= 0) return pixel;

    const dx = x - lightSourceX;
    const dy = y - lightSourceY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ray = Math.max(0, 1 - dist / Math.max(x, y, 1)) * intensity * 0.3;

    return {
      r: Math.min(1, pixel.r + ray * 0.8),
      g: Math.min(1, pixel.g + ray * 0.6),
      b: Math.min(1, pixel.b + ray * 0.3)
    };
  }
}

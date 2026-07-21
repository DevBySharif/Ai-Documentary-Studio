export class CEVignetteEngine {
  apply(pixel: { r: number; g: number; b: number }, x: number, y: number, width: number, height: number, intensity: number): { r: number; g: number; b: number } {
    const nx = (x / width) * 2 - 1;
    const ny = (y / height) * 2 - 1;
    const dist = Math.sqrt(nx * nx + ny * ny);
    const factor = 1 - intensity * Math.max(0, dist - 0.4) * 1.5;
    const clamped = Math.max(0, Math.min(1, factor));

    return {
      r: pixel.r * clamped,
      g: pixel.g * clamped,
      b: pixel.b * clamped
    };
  }
}

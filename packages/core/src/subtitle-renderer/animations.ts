import type { SRAnimationStyle } from "./types.js";

export class SRSubtitleAnimations {
  getTransform(style: SRAnimationStyle, t: number): { opacity: number; x: number; y: number; scale: number } {
    const clamped = Math.max(0, Math.min(1, t));

    switch (style) {
      case "fade":
        return { opacity: clamped, x: 0, y: 0, scale: 1 };
      case "pop":
        return { opacity: clamped, x: 0, y: 0, scale: 0.8 + clamped * 0.2 };
      case "slide":
        return { opacity: clamped, x: 0, y: (1 - clamped) * 20, scale: 1 };
      case "typewriter":
        return { opacity: clamped, x: 0, y: 0, scale: 1 };
      case "word_reveal":
        return { opacity: clamped, x: 0, y: 0, scale: 1 };
      case "scale":
        return { opacity: 1, x: 0, y: 0, scale: 0.9 + clamped * 0.1 };
      default:
        return { opacity: clamped, x: 0, y: 0, scale: 1 };
    }
  }

  getDuration(style: SRAnimationStyle): number {
    const map: Record<SRAnimationStyle, number> = {
      fade: 200, pop: 250, slide: 300, typewriter: 50, word_reveal: 100, scale: 200
    };
    return map[style];
  }
}

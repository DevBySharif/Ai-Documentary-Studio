import type { CETransitionType } from "./types.js";

export class CETransitionEffects {
  private readonly available: CETransitionType[] = ["cross_dissolve", "fade", "light_fade", "dip_to_black", "dip_to_white", "blur_transition", "motion_match"];

  getAvailable(): CETransitionType[] {
    return [...this.available];
  }

  blend(sceneA: { r: number; g: number; b: number }, sceneB: { r: number; g: number; b: number }, t: number, type: CETransitionType): { r: number; g: number; b: number } {
    switch (type) {
      case "cross_dissolve":
        return this.lerp(sceneA, sceneB, t);
      case "fade":
        return t < 0.5 ? this.lerp(sceneA, { r: 0, g: 0, b: 0 }, t * 2) : this.lerp({ r: 0, g: 0, b: 0 }, sceneB, (t - 0.5) * 2);
      case "light_fade":
        return this.lerp(sceneA, { r: 1, g: 1, b: 1 }, t * 0.5);
      case "dip_to_black":
        return t < 0.5 ? this.lerp(sceneA, { r: 0, g: 0, b: 0 }, t * 2) : this.lerp({ r: 0, g: 0, b: 0 }, sceneB, (t - 0.5) * 2);
      case "dip_to_white":
        return t < 0.5 ? this.lerp(sceneA, { r: 1, g: 1, b: 1 }, t * 2) : this.lerp({ r: 1, g: 1, b: 1 }, sceneB, (t - 0.5) * 2);
      case "blur_transition":
        return this.lerp(sceneA, sceneB, t * t);
      case "motion_match":
        return this.lerp(sceneA, sceneB, t);
      default:
        return this.lerp(sceneA, sceneB, t);
    }
  }

  private lerp(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number): { r: number; g: number; b: number } {
    return {
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    };
  }
}

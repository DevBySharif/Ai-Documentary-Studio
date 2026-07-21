import type { AMStereoMode } from "./types.js";

export class AMStereoImaging {
  private width: number = 1;

  setWidth(width: number): void {
    this.width = Math.max(0, Math.min(1, width));
  }

  getWidth(): number {
    return this.width;
  }

  getDefaultMode(layer: string): AMStereoMode {
    switch (layer) {
      case "narration": return "mono";
      case "background_music": return "stereo";
      case "ambience": return "stereo";
      case "sound_effects": return "mono";
      case "transition_effects": return "stereo";
      default: return "stereo";
    }
  }

  centerNarration(left: number, right: number): [number, number] {
    const mono = (left + right) / 2;
    return [mono, mono];
  }

  applyWidth(left: number, right: number, width: number): [number, number] {
    const mid = (left + right) / 2;
    const side = (left - right) / 2;
    const newSide = side * width;
    return [mid + newSide, mid - newSide];
  }

  isCompatible(mode: AMStereoMode): boolean {
    return true;
  }
}

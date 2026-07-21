import type { SRPosition } from "./types.js";

export class SRSmartPositioning {
  private readonly safeZones = {
    bottom: { x: 0.05, y: 0.85, width: 0.9, height: 0.1 },
    top: { x: 0.05, y: 0.03, width: 0.9, height: 0.1 },
    center: { x: 0.15, y: 0.4, width: 0.7, height: 0.2 }
  };

  determinePosition(
    preferred: SRPosition,
    faceBox: { x: number; y: number; width: number; height: number } | null,
    sceneBrightness: number
  ): SRPosition {
    if (preferred === "adaptive") {
      if (faceBox && faceBox.y + faceBox.height > 0.7) return "top";
      if (sceneBrightness > 0.8) return "bottom";
      return "bottom";
    }
    return preferred;
  }

  getPositionCoords(position: SRPosition, frameWidth: number, frameHeight: number): { x: number; y: number; width: number; height: number } {
    const zone = (position === "adaptive" ? this.safeZones.bottom : this.safeZones[position]) ?? this.safeZones.bottom;
    return {
      x: zone.x * frameWidth,
      y: zone.y * frameHeight,
      width: zone.width * frameWidth,
      height: zone.height * frameHeight
    };
  }
}

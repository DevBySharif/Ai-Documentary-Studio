import type { SRSafeZone } from "./types.js";

export class SRSafeAreaSystem {
  private zone: SRSafeZone = { top: 0.05, bottom: 0.1, left: 0.05, right: 0.05 };

  configure(zone: Partial<SRSafeZone>): void {
    this.zone = { ...this.zone, ...zone };
  }

  getZone(): SRSafeZone {
    return { ...this.zone };
  }

  isInSafeArea(x: number, y: number, width: number, height: number, frameW: number, frameH: number): boolean {
    const marginX = this.zone.left * frameW;
    const marginY = this.zone.top * frameH;
    return (
      x >= marginX &&
      y >= marginY &&
      x + width <= frameW - this.zone.right * frameW &&
      y + height <= frameH - this.zone.bottom * frameH
    );
  }

  getSafeRect(frameW: number, frameH: number): { x: number; y: number; width: number; height: number } {
    return {
      x: this.zone.left * frameW,
      y: this.zone.top * frameH,
      width: frameW * (1 - this.zone.left - this.zone.right),
      height: frameH * (1 - this.zone.top - this.zone.bottom)
    };
  }

  getMobileSafeZone(): SRSafeZone {
    return { top: 0.08, bottom: 0.15, left: 0.05, right: 0.05 };
  }

  getTVSafeZone(): SRSafeZone {
    return { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 };
  }
}

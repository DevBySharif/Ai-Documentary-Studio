import type { SafeAreaBounds } from "./types.js";

export interface SafeAreaViolation {
  element: string;
  zone: string;
  severity: "warning" | "critical";
}

export class SafeAreaManager {
  private config: SafeAreaBounds = {
    top: 0.05, bottom: 0.1, left: 0.05, right: 0.05,
    subtitleZone: { x: 0.1, y: 0.85, width: 0.8, height: 0.1 }
  };

  configure(bounds: Partial<SafeAreaBounds>): void {
    this.config = { ...this.config, ...bounds };
  }

  getConfig(): SafeAreaBounds {
    return { ...this.config };
  }

  checkSubtitle(text: string, x: number, y: number): SafeAreaViolation | null {
    const sz = this.config.subtitleZone;
    if (x < sz.x || x + text.length * 10 > sz.x + sz.width || y < sz.y || y > sz.y + sz.height) {
      return { element: "subtitle", zone: "subtitle_zone", severity: "critical" };
    }
    return null;
  }

  checkElement(x: number, y: number, width: number, height: number, _totalWidth: number, totalHeight: number): SafeAreaViolation | null {
    const marginX = this.config.left * totalHeight;
    const marginY = this.config.top * totalHeight;
    if (x < marginX || y < marginY || x + width > totalHeight - this.config.right * totalHeight) {
      return { element: "visual", zone: "safe_area", severity: "warning" };
    }
    return null;
  }

  reserveSubtitleZone(height: number): { x: number; y: number; width: number; height: number } {
    return this.config.subtitleZone;
  }

  reserveLogoZone(): { x: number; y: number; width: number; height: number } {
    return { x: 0.02, y: 0.02, width: 0.1, height: 0.06 };
  }

  reserveWatermarkZone(): { x: number; y: number; width: number; height: number } {
    return { x: 0.88, y: 0.02, width: 0.1, height: 0.06 };
  }
}

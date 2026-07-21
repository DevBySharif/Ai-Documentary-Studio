export interface FramingTarget {
  type: "character" | "object" | "symbol" | "keyword";
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export class AutoFramingEngine {
  frame(targets: FramingTarget[], frameWidth: number, frameHeight: number): { x: number; y: number; zoom: number } {
    if (targets.length === 0) return { x: frameWidth / 2, y: frameHeight / 2, zoom: 1 };

    const primary = targets.sort((a, b) => b.confidence - a.confidence)[0];
    const cx = primary.x + primary.width / 2;
    const cy = primary.y + primary.height / 2;

    const targetWidth = primary.width * 2.5;
    const zoom = Math.min(frameWidth / targetWidth, frameHeight / (primary.height * 2.5));

    return {
      x: Math.max(0, Math.min(frameWidth, cx - frameWidth / (2 * zoom))),
      y: Math.max(0, Math.min(frameHeight, cy - frameHeight / (2 * zoom))),
      zoom
    };
  }

  trackSubject(targets: FramingTarget[], previousFrame: { x: number; y: number; zoom: number }): { x: number; y: number; zoom: number } {
    if (targets.length === 0) return previousFrame;
    const primary = targets.sort((a, b) => b.confidence - a.confidence)[0];
    const cx = primary.x + primary.width / 2;
    const cy = primary.y + primary.height / 2;
    return {
      x: previousFrame.x * 0.7 + cx * 0.3,
      y: previousFrame.y * 0.7 + cy * 0.3,
      zoom: previousFrame.zoom
    };
  }
}

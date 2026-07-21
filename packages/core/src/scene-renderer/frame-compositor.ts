import type { SceneLayer, CameraTransform } from "./types.js";

export class FrameCompositor {
  composeFrame(layers: SceneLayer[], camera: CameraTransform, frameWidth: number, frameHeight: number): Record<string, unknown> {
    const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    return {
      width: frameWidth,
      height: frameHeight,
      camera,
      layerCount: sorted.length,
      layers: sorted.map((l) => ({
        type: l.type,
        opacity: l.opacity,
        blendMode: l.blendMode,
        zIndex: l.zIndex
      })),
      timestamp: Date.now()
    };
  }
}

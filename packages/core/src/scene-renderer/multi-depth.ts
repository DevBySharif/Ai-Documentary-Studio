import type { DepthLayer, CameraTransform } from "./types.js";

export class MultiLayerDepthEngine {
  private readonly defaultLayers: DepthLayer[] = [
    { index: 0, label: "foreground", parallaxSpeed: 4, opacity: 1, mask: "" },
    { index: 1, label: "character", parallaxSpeed: 0, opacity: 1, mask: "" },
    { index: 2, label: "objects", parallaxSpeed: 2, opacity: 1, mask: "" },
    { index: 3, label: "environment", parallaxSpeed: 1, opacity: 1, mask: "" },
    { index: 4, label: "sky", parallaxSpeed: 0.5, opacity: 1, mask: "" }
  ];

  extract(_image: string): DepthLayer[] {
    return [...this.defaultLayers];
  }

  applyMotion(layers: DepthLayer[], camera: CameraTransform): Array<{ layer: DepthLayer; offsetX: number; offsetY: number; scale: number }> {
    return layers.map((layer) => {
      const speed = layer.parallaxSpeed / 10;
      return {
        layer,
        offsetX: camera.x * speed,
        offsetY: camera.y * speed * 0.5,
        scale: 1 + speed * (camera.zoom - 1) * 0.1
      };
    });
  }

  getLayerByLabel(layers: DepthLayer[], label: DepthLayer["label"]): DepthLayer | undefined {
    return layers.find((l) => l.label === label);
  }
}

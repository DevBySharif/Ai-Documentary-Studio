import type { DepthLayer, CameraTransform } from "./types.js";

export class SceneParallaxCompositor {
  compose(depthLayers: DepthLayer[], camera: CameraTransform, frameWidth: number, _frameHeight: number): Array<{ layer: DepthLayer; offsetX: number; offsetY: number }> {
    return depthLayers.map((layer) => {
      const parallaxFactor = layer.parallaxSpeed / 10;
      return {
        layer,
        offsetX: camera.x * parallaxFactor + camera.parallaxOffset * parallaxFactor,
        offsetY: camera.y * parallaxFactor * 0.5
      };
    });
  }

  applyKenBurns(layers: Array<{ layer: DepthLayer; offsetX: number; offsetY: number }>, progress: number): Array<{ layer: DepthLayer; offsetX: number; offsetY: number }> {
    return layers.map((item) => ({
      layer: item.layer,
      offsetX: item.offsetX * progress,
      offsetY: item.offsetY * progress
    }));
  }
}

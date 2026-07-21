import type { SceneComposition, SceneLayer, CameraTransform, SceneLightingConfig, DepthLayer } from "./types.js";
import { LayerBasedRenderer } from "./layers.js";

export class SceneCompositor {
  private renderer = new LayerBasedRenderer();

  compose(sceneIndex: number, image: string, camera: CameraTransform, lighting: SceneLightingConfig, layers: SceneLayer[], depthLayers: DepthLayer[]): SceneComposition {
    return {
      sceneIndex,
      image,
      layers,
      camera,
      lighting,
      focus: { type: "object", x: 0, y: 0, width: 0, height: 0, softenBackground: false },
      safeArea: { top: 0.05, bottom: 0.1, left: 0.05, right: 0.05, subtitleZone: { x: 0.1, y: 0.85, width: 0.8, height: 0.1 } },
      cropping: { x: 0, y: 0, width: 1920, height: 1080, aspectRatio: "16:9" },
      depthLayers
    };
  }

  getLayerRenderer(): LayerBasedRenderer {
    return this.renderer;
  }
}

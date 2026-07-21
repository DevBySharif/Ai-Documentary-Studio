import type { SceneLayer, SceneLayerType } from "./types.js";

export class LayerBasedRenderer {
  private layers: SceneLayer[] = [];

  createLayer(type: SceneLayerType, zIndex: number, content: Record<string, unknown>): SceneLayer {
    const layer: SceneLayer = { type, zIndex, opacity: 1, blendMode: "normal", content };
    this.layers.push(layer);
    this.layers.sort((a, b) => a.zIndex - b.zIndex);
    return layer;
  }

  removeLayer(type: SceneLayerType): void {
    this.layers = this.layers.filter((l) => l.type !== type);
  }

  updateLayer(type: SceneLayerType, updates: Partial<SceneLayer>): void {
    const layer = this.layers.find((l) => l.type === type);
    if (layer) Object.assign(layer, updates);
  }

  getLayers(): SceneLayer[] {
    return [...this.layers];
  }

  getLayer(type: SceneLayerType): SceneLayer | undefined {
    return this.layers.find((l) => l.type === type);
  }

  compose(): Record<string, unknown>[] {
    return this.layers.map((l) => ({
      type: l.type,
      zIndex: l.zIndex,
      opacity: l.opacity,
      blendMode: l.blendMode,
      rendered: l.content
    }));
  }

  clear(): void {
    this.layers = [];
  }
}

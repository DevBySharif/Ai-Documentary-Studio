import type { MPLayer } from "./types.js";

export class MPSystemLayers {
  private readonly layers: MPLayer[] = ["presentation", "application", "ai", "rendering", "infrastructure"];

  getLayers(): MPLayer[] {
    return [...this.layers];
  }

  getLayer(index: number): MPLayer | undefined {
    return this.layers[index];
  }

  getLayerIndex(layer: MPLayer): number {
    return this.layers.indexOf(layer);
  }

  validateLayer(layer: MPLayer): boolean {
    return this.layers.includes(layer);
  }
}

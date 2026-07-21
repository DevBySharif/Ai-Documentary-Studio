import type { DASystemLayer } from "./types.js";

export class DASystemLayers {
  private readonly layers: DASystemLayer[] = ["presentation", "application", "production", "rendering", "infrastructure"];

  getLayers(): DASystemLayer[] {
    return [...this.layers];
  }

  getLayerIndex(layer: DASystemLayer): number {
    return this.layers.indexOf(layer);
  }

  validateDependency(from: DASystemLayer, to: DASystemLayer): boolean {
    const fromIdx = this.getLayerIndex(from);
    const toIdx = this.getLayerIndex(to);
    return toIdx >= fromIdx;
  }
}

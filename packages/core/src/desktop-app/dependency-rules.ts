import type { DASystemLayer } from "./types.js";

export class DADependencyRules {
  check(lower: DASystemLayer, higher: DASystemLayer): boolean {
    const order: DASystemLayer[] = ["infrastructure", "rendering", "production", "application", "presentation"];
    const lowerIdx = order.indexOf(lower);
    const higherIdx = order.indexOf(higher);
    return lowerIdx <= higherIdx;
  }

  allowedDependents(layer: DASystemLayer): DASystemLayer[] {
    const order: DASystemLayer[] = ["infrastructure", "rendering", "production", "application", "presentation"];
    const idx = order.indexOf(layer);
    return order.slice(idx);
  }
}

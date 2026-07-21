import type { DepthLayer } from "./types.js";

export class DepthMapEngine {
  estimate(_image: string): DepthLayer[] {
    const layers: DepthLayer[] = [
      { index: 0, label: "foreground", parallaxSpeed: 4, opacity: 1, mask: "" },
      { index: 1, label: "character", parallaxSpeed: 0, opacity: 1, mask: "" },
      { index: 2, label: "objects", parallaxSpeed: 2, opacity: 1, mask: "" },
      { index: 3, label: "environment", parallaxSpeed: 1, opacity: 1, mask: "" },
      { index: 4, label: "sky", parallaxSpeed: 0.5, opacity: 1, mask: "" }
    ];
    return layers;
  }

  extractForeground(depthLayers: DepthLayer[]): DepthLayer | undefined {
    return depthLayers.find((l) => l.label === "foreground");
  }

  extractBackground(depthLayers: DepthLayer[]): DepthLayer | undefined {
    return depthLayers.find((l) => l.label === "sky" || l.label === "environment");
  }
}

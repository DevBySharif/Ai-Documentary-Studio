import type { PDUIInteraction, PDResourceUsage } from "./types.js";

export class PDUserInteraction {
  getDisplay(currentStage: string, progress: number, warnings: string[], estimatedTime: string, resources: PDResourceUsage, qualityStatus: string): PDUIInteraction {
    return { currentStage, progress, warnings, estimatedTime, resourceUsage: resources, qualityStatus };
  }
}

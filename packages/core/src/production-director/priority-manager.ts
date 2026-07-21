import type { PDEngineType } from "./types.js";

export class PDPriorityManager {
  private readonly priority: PDEngineType[] = [
    "script", "voice", "timeline", "image_approval", "motion", "effects", "export"
  ];

  getPriority(engine: PDEngineType): number {
    const idx = this.priority.indexOf(engine);
    return idx >= 0 ? this.priority.length - idx : 0;
  }

  getHighestPriority(engines: PDEngineType[]): PDEngineType {
    return engines.sort((a, b) => this.getPriority(b) - this.getPriority(a))[0];
  }

  getSortedByPriority(): PDEngineType[] {
    return [...this.priority];
  }
}

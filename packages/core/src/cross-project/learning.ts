import type { LearningResult } from "./types.js";

export class LearningEngine {
  private results = new Map<string, LearningResult>();

  store(result: LearningResult): void {
    if (!result?.projectId) throw new Error("LearningResult with projectId is required");
    result.storedAt = new Date().toISOString();
    this.results.set(result.projectId, result);
  }

  get(projectId: string): LearningResult | undefined {
    return this.results.get(projectId);
  }

  getWorkedStrategies(): string[] {
    const strategySet = new Set<string>();
    for (const r of this.results.values()) {
      for (const w of r.worked) strategySet.add(w);
    }
    return Array.from(strategySet);
  }

  getFailedStrategies(): string[] {
    const strategySet = new Set<string>();
    for (const r of this.results.values()) {
      for (const f of r.failed) strategySet.add(f);
    }
    return Array.from(strategySet);
  }

  getImprovements(): string[] {
    const improvements: string[] = [];
    for (const r of this.results.values()) {
      improvements.push(...r.improvements);
    }
    return improvements;
  }
}

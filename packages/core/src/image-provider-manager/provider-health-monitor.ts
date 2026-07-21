import { IPProviderName, IPHealthStatus } from "./types";

interface IPProviderStats {
  totalGenerations: number;
  successfulGenerations: number;
  totalTime: number;
  queueTime: number;
  failures: number;
  qualityScores: number[];
}

export class IPProviderHealthMonitor {
  private stats: Map<IPProviderName, IPProviderStats> = new Map();

  private getOrCreateStats(provider: IPProviderName): IPProviderStats {
    if (!this.stats.has(provider)) {
      this.stats.set(provider, {
        totalGenerations: 0,
        successfulGenerations: 0,
        totalTime: 0,
        queueTime: 0,
        failures: 0,
        qualityScores: [],
      });
    }
    return this.stats.get(provider)!;
  }

  recordGeneration(provider: IPProviderName, success: boolean, time: number, qualityScore?: number): void {
    const stats = this.getOrCreateStats(provider);
    stats.totalGenerations++;
    if (success) {
      stats.successfulGenerations++;
      stats.totalTime += time;
    } else {
      stats.failures++;
    }
    if (qualityScore !== undefined) {
      stats.qualityScores.push(qualityScore);
    }
  }

  recordQueueTime(provider: IPProviderName, queueTime: number): void {
    const stats = this.getOrCreateStats(provider);
    stats.queueTime += queueTime;
  }

  getSuccessRate(provider: IPProviderName): number {
    const stats = this.stats.get(provider);
    if (!stats || stats.totalGenerations === 0) {
      return 1;
    }
    return stats.successfulGenerations / stats.totalGenerations;
  }

  getAverageGenerationTime(provider: IPProviderName): number {
    const stats = this.stats.get(provider);
    if (!stats || stats.successfulGenerations === 0) {
      return 0;
    }
    return stats.totalTime / stats.successfulGenerations;
  }

  getFailureRate(provider: IPProviderName): number {
    const stats = this.stats.get(provider);
    if (!stats || stats.totalGenerations === 0) {
      return 0;
    }
    return stats.failures / stats.totalGenerations;
  }

  getAverageQualityScore(provider: IPProviderName): number {
    const stats = this.stats.get(provider);
    if (!stats || stats.qualityScores.length === 0) {
      return 0;
    }
    return stats.qualityScores.reduce((a, b) => a + b, 0) / stats.qualityScores.length;
  }

  getHealth(provider: IPProviderName): IPHealthStatus {
    const stats = this.stats.get(provider);
    if (!stats || stats.totalGenerations === 0) {
      return "healthy";
    }
    const successRate = this.getSuccessRate(provider);
    if (successRate < 0.5) {
      return "unavailable";
    }
    if (successRate < 0.8 || this.getAverageGenerationTime(provider) > 10000) {
      return "degraded";
    }
    return "healthy";
  }

  getScore(provider: IPProviderName): number {
    const stats = this.stats.get(provider);
    if (!stats || stats.totalGenerations === 0) {
      return 100;
    }
    const successWeight = 0.4;
    const speedWeight = 0.25;
    const qualityWeight = 0.25;
    const queueWeight = 0.1;

    const successScore = this.getSuccessRate(provider) * 100;
    const avgTime = this.getAverageGenerationTime(provider);
    const speedScore = avgTime > 0 ? Math.max(0, 100 - (avgTime / 100) * 5) : 100;
    const qualityScore = this.getAverageQualityScore(provider);
    const queueScore = stats.queueTime > 0 ? Math.max(0, 100 - (stats.queueTime / 1000) * 2) : 100;

    return Math.round(
      successScore * successWeight +
        speedScore * speedWeight +
        qualityScore * qualityWeight +
        queueScore * queueWeight
    );
  }

  getUnhealthyProviders(): IPProviderName[] {
    const unhealthy: IPProviderName[] = [];
    for (const [provider] of this.stats.entries()) {
      const health = this.getHealth(provider);
      if (health !== "healthy") {
        unhealthy.push(provider);
      }
    }
    return unhealthy;
  }

  getStats(provider: IPProviderName): IPProviderStats | undefined {
    return this.stats.get(provider);
  }

  getAllStats(): Map<IPProviderName, IPProviderStats> {
    return new Map(this.stats);
  }
}

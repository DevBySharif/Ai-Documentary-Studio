import type { APBenchmark, APProviderName } from "./types.js";

export class APBenchmarkDatabase {
  private benchmarks: APBenchmark[] = [];

  record(provider: APProviderName, model: string, latency: number, jsonAccuracy: number, promptQuality: number, hallucination: number, costEfficiency: number, stability: number): void {
    this.benchmarks.push({ provider, model, avgLatency: latency, jsonAccuracy, promptQuality, hallucinationRate: hallucination, costEfficiency, stability });
  }

  getBestForLatency(): APBenchmark | undefined {
    return [...this.benchmarks].sort((a, b) => a.avgLatency - b.avgLatency)[0];
  }

  getBestForAccuracy(): APBenchmark | undefined {
    return [...this.benchmarks].sort((a, b) => b.jsonAccuracy - a.jsonAccuracy)[0];
  }

  getAll(): APBenchmark[] {
    return [...this.benchmarks];
  }

  clear(): void {
    this.benchmarks = [];
  }
}

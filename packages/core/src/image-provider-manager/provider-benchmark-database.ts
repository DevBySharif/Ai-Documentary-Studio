import { IPBenchmark, IPProviderName } from "./types";

export class IPProviderBenchmarkDatabase {
  private benchmarks: Map<IPProviderName, IPBenchmark[]> = new Map();

  record(benchmark: IPBenchmark): void {
    if (!this.benchmarks.has(benchmark.provider)) {
      this.benchmarks.set(benchmark.provider, []);
    }
    this.benchmarks.get(benchmark.provider)!.push({ ...benchmark });
  }

  getForProvider(provider: IPProviderName): IPBenchmark[] {
    return this.benchmarks.get(provider) ?? [];
  }

  getLatestForProvider(provider: IPProviderName): IPBenchmark | undefined {
    const entries = this.benchmarks.get(provider);
    if (!entries || entries.length === 0) return undefined;
    return entries[entries.length - 1];
  }

  getBestForPromptFidelity(): IPBenchmark | undefined {
    let best: IPBenchmark | undefined;
    for (const entries of this.benchmarks.values()) {
      for (const b of entries) {
        if (!best || b.promptFidelity > best.promptFidelity) {
          best = b;
        }
      }
    }
    return best;
  }

  getBestForCharacterConsistency(): IPBenchmark | undefined {
    let best: IPBenchmark | undefined;
    for (const entries of this.benchmarks.values()) {
      for (const b of entries) {
        if (!best || b.characterConsistency > best.characterConsistency) {
          best = b;
        }
      }
    }
    return best;
  }

  getBestForSpeed(): IPBenchmark | undefined {
    let best: IPBenchmark | undefined;
    for (const entries of this.benchmarks.values()) {
      for (const b of entries) {
        if (!best || b.avgGenerationTime < best.avgGenerationTime) {
          best = b;
        }
      }
    }
    return best;
  }

  getBestForCost(): IPBenchmark | undefined {
    let best: IPBenchmark | undefined;
    for (const entries of this.benchmarks.values()) {
      for (const b of entries) {
        if (!best || b.costEfficiency > best.costEfficiency) {
          best = b;
        }
      }
    }
    return best;
  }

  getAll(): IPBenchmark[] {
    const all: IPBenchmark[] = [];
    for (const entries of this.benchmarks.values()) {
      all.push(...entries);
    }
    return all;
  }

  getAverages(): Map<IPProviderName, IPBenchmark> {
    const averages = new Map<IPProviderName, IPBenchmark>();
    for (const [provider, entries] of this.benchmarks.entries()) {
      if (entries.length === 0) continue;
      const sum = entries.reduce(
        (acc, b) => ({
          avgGenerationTime: acc.avgGenerationTime + b.avgGenerationTime,
          promptFidelity: acc.promptFidelity + b.promptFidelity,
          characterConsistency: acc.characterConsistency + b.characterConsistency,
          styleAccuracy: acc.styleAccuracy + b.styleAccuracy,
          failureRate: acc.failureRate + b.failureRate,
          costEfficiency: acc.costEfficiency + b.costEfficiency,
        }),
        {
          avgGenerationTime: 0,
          promptFidelity: 0,
          characterConsistency: 0,
          styleAccuracy: 0,
          failureRate: 0,
          costEfficiency: 0,
        }
      );
      const count = entries.length;
      averages.set(provider, {
        provider,
        avgGenerationTime: sum.avgGenerationTime / count,
        promptFidelity: sum.promptFidelity / count,
        characterConsistency: sum.characterConsistency / count,
        styleAccuracy: sum.styleAccuracy / count,
        failureRate: sum.failureRate / count,
        costEfficiency: sum.costEfficiency / count,
      });
    }
    return averages;
  }
}

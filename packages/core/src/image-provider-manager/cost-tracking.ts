import { IPProviderName } from "./types";

interface IPProjectCostStats {
  imagesGenerated: number;
  totalCost: number;
  failedGenerations: number;
  retryCount: number;
  cacheHits: number;
  providerUsage: Map<IPProviderName, number>;
  providerCosts: Map<IPProviderName, number>;
}

export class IPCostTracking {
  private projects: Map<string, IPProjectCostStats> = new Map();

  private getProject(projectId: string): IPProjectCostStats {
    if (!this.projects.has(projectId)) {
      this.projects.set(projectId, {
        imagesGenerated: 0,
        totalCost: 0,
        failedGenerations: 0,
        retryCount: 0,
        cacheHits: 0,
        providerUsage: new Map(),
        providerCosts: new Map(),
      });
    }
    return this.projects.get(projectId)!;
  }

  recordGeneration(projectId: string, provider: IPProviderName, cost: number, success: boolean): void {
    const project = this.getProject(projectId);
    project.imagesGenerated++;
    project.totalCost += cost;
    project.providerUsage.set(provider, (project.providerUsage.get(provider) ?? 0) + 1);
    project.providerCosts.set(provider, (project.providerCosts.get(provider) ?? 0) + cost);
    if (!success) {
      project.failedGenerations++;
    }
  }

  recordCacheHit(projectId: string): void {
    const project = this.getProject(projectId);
    project.cacheHits++;
  }

  recordRetry(projectId: string, provider: IPProviderName): void {
    const project = this.getProject(projectId);
    project.retryCount++;
    project.providerUsage.set(provider, (project.providerUsage.get(provider) ?? 0) + 1);
  }

  getProjectStats(projectId: string): {
    imagesGenerated: number;
    totalCost: number;
    failedGenerations: number;
    retryCount: number;
    cacheHits: number;
    averageCostPerImage: number;
  } {
    const project = this.getProject(projectId);
    return {
      imagesGenerated: project.imagesGenerated,
      totalCost: project.totalCost,
      failedGenerations: project.failedGenerations,
      retryCount: project.retryCount,
      cacheHits: project.cacheHits,
      averageCostPerImage: project.imagesGenerated > 0 ? project.totalCost / project.imagesGenerated : 0,
    };
  }

  getProviderUsage(provider: IPProviderName): {
    totalUses: number;
    totalCost: number;
    projects: string[];
  } {
    let totalUses = 0;
    let totalCost = 0;
    const projects: string[] = [];
    for (const [projectId, stats] of this.projects.entries()) {
      const usage = stats.providerUsage.get(provider) ?? 0;
      if (usage > 0) {
        totalUses += usage;
        totalCost += stats.providerCosts.get(provider) ?? 0;
        projects.push(projectId);
      }
    }
    return { totalUses, totalCost, projects };
  }

  getAllProjectIds(): string[] {
    return Array.from(this.projects.keys());
  }

  resetProject(projectId: string): void {
    this.projects.delete(projectId);
  }
}

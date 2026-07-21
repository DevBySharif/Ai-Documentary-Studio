import { HardwareMetrics, CostData } from './types';

export class IntelligentRecommendationEngine {
  generateRecommendations(metrics: HardwareMetrics, costs: CostData): string[] {
    const recommendations: string[] = [];

    // Hardware recommendations
    if (metrics.gpuUsagePct < 20 && metrics.cpuUsagePct > 80) {
      recommendations.push("Enable GPU acceleration to offload CPU rendering tasks.");
    }

    if (metrics.ramUsageMB > 32000) {
      recommendations.push("Increase cache size or close inactive projects to free up RAM.");
    }

    if (metrics.diskUsageMB > 900000) { // e.g., 900GB
      recommendations.push("Archive inactive projects. Disk space is running low.");
    }

    // Cost recommendations
    if (costs.aiCosts > 100) { // arbitrary threshold
      recommendations.push("Consider switching to a faster or more cost-effective AI provider for draft generation.");
    }

    if (costs.imageCosts > 50) {
      recommendations.push("Reuse existing images instead of regenerating to save image API costs.");
    }

    return recommendations;
  }
}

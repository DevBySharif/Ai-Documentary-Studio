import { CostData } from './types';

export class CostAnalytics {
  private accumulatedCosts: CostData = {
    aiCosts: 0,
    imageCosts: 0,
    voiceCosts: 0,
    renderingCosts: 0,
    storageCosts: 0
  };

  recordCost(category: keyof CostData, amountUSD: number): void {
    this.accumulatedCosts[category] += amountUSD;
  }

  getCostBreakdown(): CostData {
    return { ...this.accumulatedCosts };
  }

  getTotalCost(): number {
    return Object.values(this.accumulatedCosts).reduce((sum, cost) => sum + cost, 0);
  }

  getProjectCosts(projectId: string): CostData {
    // Mock fetching costs specific to a project
    return { ...this.accumulatedCosts };
  }
}

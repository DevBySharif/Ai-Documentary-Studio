/**
 * Production Memory Manager (Vol 04 Part 10 - Section 15).
 * Maintains persistent awareness of project goals, locked assets, accepted decisions, and rejected ideas.
 */
export class ProductionMemory {
  private projectGoals: string[] = [];
  private lockedAssetIds = new Set<string>();
  private acceptedDecisions: string[] = [];
  private rejectedIdeas: string[] = [];

  public addProjectGoal(goal: string): void {
    this.projectGoals.push(goal);
  }

  public lockAsset(assetId: string): void {
    this.lockedAssetIds.add(assetId);
  }

  public recordDecision(decision: string, isAccepted: boolean): void {
    if (isAccepted) {
      this.acceptedDecisions.push(decision);
    } else {
      this.rejectedIdeas.push(decision);
    }
  }

  public getSummary(): { goalsCount: number; lockedAssetsCount: number; acceptedDecisionsCount: number } {
    return {
      goalsCount: this.projectGoals.length,
      lockedAssetsCount: this.lockedAssetIds.size,
      acceptedDecisionsCount: this.acceptedDecisions.length,
    };
  }
}

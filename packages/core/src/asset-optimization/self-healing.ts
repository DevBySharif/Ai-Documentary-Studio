export interface HealingAction {
  assetId: string;
  action: string;
  timestamp: string;
  success: boolean;
}

export class SelfHealingLibrary {
  private actions: HealingAction[] = [];

  async repair(issue: { assetId: string; problem: string; repairFn: () => Promise<boolean> }): Promise<HealingAction> {
    let success = false;
    try {
      success = await issue.repairFn();
    } catch {
      success = false;
    }

    const action: HealingAction = {
      assetId: issue.assetId,
      action: issue.problem,
      timestamp: new Date().toISOString(),
      success
    };
    this.actions.push(action);
    return action;
  }

  getRepairHistory(): HealingAction[] {
    return [...this.actions];
  }

  getRepairCount(): { total: number; succeeded: number; failed: number } {
    const total = this.actions.length;
    const succeeded = this.actions.filter((a) => a.success).length;
    return { total, succeeded, failed: total - succeeded };
  }
}

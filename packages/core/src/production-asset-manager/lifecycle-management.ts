import type { PAAssetStatus } from "./types.js";

const TRANSITIONS: Record<PAAssetStatus, PAAssetStatus[]> = {
  generated: ["validated", "deleted"],
  validated: ["approved", "archived", "deleted"],
  approved: ["used", "archived", "deleted"],
  used: ["archived", "deleted"],
  archived: ["deleted"],
  deleted: [],
};

export class PALifecycleManagement {
  private statuses: Map<string, PAAssetStatus> = new Map();
  private statusHistory: Map<string, { from: PAAssetStatus; to: PAAssetStatus; date: string }[]> = new Map();

  transition(assetId: string, targetStatus: PAAssetStatus): boolean {
    const current = this.statuses.get(assetId) ?? "generated";
    if (!this.canTransition(current, targetStatus)) return false;
    const from = current;
    this.statuses.set(assetId, targetStatus);
    if (!this.statusHistory.has(assetId)) this.statusHistory.set(assetId, []);
    this.statusHistory.get(assetId)!.push({
      from,
      to: targetStatus,
      date: new Date().toISOString(),
    });
    return true;
  }

  getStatus(assetId: string): PAAssetStatus {
    return this.statuses.get(assetId) ?? "generated";
  }

  canTransition(current: PAAssetStatus, target: PAAssetStatus): boolean {
    return TRANSITIONS[current]?.includes(target) ?? false;
  }

  getValidTransitions(current: PAAssetStatus): PAAssetStatus[] {
    return TRANSITIONS[current] ?? [];
  }

  purgeDeleted(daysOld: number): number {
    const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    let count = 0;
    for (const [assetId, history] of this.statusHistory) {
      const lastEntry = history[history.length - 1];
      if (lastEntry?.to === "deleted" && new Date(lastEntry.date).getTime() < cutoff) {
        this.statuses.delete(assetId);
        this.statusHistory.delete(assetId);
        count++;
      }
    }
    return count;
  }
}

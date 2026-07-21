interface RetentionResult {
  category: string;
  deletedCount: number;
  freedBytes: number;
}

interface RetentionReport {
  category: string;
  retentionDays: number;
  currentSize: number;
  deletableCount: number;
}

export class PDDataRetentionPolicy {
  private policies = new Map<string, number>();
  private dataStore = new Map<string, { date: Date; size: number }[]>();

  constructor() {
    this.policies.set("audit_logs", 365);
    this.policies.set("event_store", 180);
    this.policies.set("version_history", 90);
    this.policies.set("backups", 30);
    this.policies.set("temporary_data", 7);
  }

  setPolicy(category: string, retentionDays: number): void {
    this.policies.set(category, retentionDays);
  }

  getPolicy(category: string): number {
    return this.policies.get(category) || 0;
  }

  applyRetention(): RetentionResult[] {
    const results: RetentionResult[] = [];
    const now = Date.now();

    for (const [category, retentionDays] of this.policies) {
      const items = this.dataStore.get(category) || [];
      const cutoff = now - retentionDays * 86400000;
      const deletable = items.filter((item) => item.date.getTime() < cutoff);
      const kept = items.filter((item) => item.date.getTime() >= cutoff);

      const deletedCount = deletable.length;
      const freedBytes = deletable.reduce((sum, item) => sum + item.size, 0);
      this.dataStore.set(category, kept);

      results.push({ category, deletedCount, freedBytes });
    }
    return results;
  }

  getRetentionReport(): RetentionReport[] {
    const now = Date.now();
    return Array.from(this.policies.entries()).map(([category, retentionDays]) => {
      const items = this.dataStore.get(category) || [];
      const cutoff = now - retentionDays * 86400000;
      const deletableCount = items.filter((item) => item.date.getTime() < cutoff).length;
      const currentSize = items.reduce((sum, item) => sum + item.size, 0);
      return { category, retentionDays, currentSize, deletableCount };
    });
  }
}

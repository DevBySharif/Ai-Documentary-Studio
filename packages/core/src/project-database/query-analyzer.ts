interface SlowQuery {
  sql: string;
  duration: number;
  avgDuration: number;
  count: number;
}

interface LockContention {
  table: string;
  waitTime: number;
}

export class PDQueryAnalyzer {
  private queryLogs: { sql: string; duration: number; timestamp: Date }[] = [];

  recordQuery(duration: number, sql: string): void {
    this.queryLogs.push({ sql, duration, timestamp: new Date() });
  }

  getSlowQueries(threshold: number): SlowQuery[] {
    const grouped = new Map<string, { totalDuration: number; count: number }>();

    for (const log of this.queryLogs) {
      if (log.duration > threshold) {
        const existing = grouped.get(log.sql) || { totalDuration: 0, count: 0 };
        existing.totalDuration += log.duration;
        existing.count++;
        grouped.set(log.sql, existing);
      }
    }

    return Array.from(grouped.entries()).map(([sql, stats]) => ({
      sql,
      duration: stats.totalDuration,
      avgDuration: stats.totalDuration / stats.count,
      count: stats.count,
    }));
  }

  detectMissingIndexes(): string[] {
    const slowQueries = this.queryLogs.filter((q) => q.duration > 100);
    const tables = new Set<string>();
    for (const q of slowQueries) {
      const match = q.sql.match(/(?:FROM|JOIN)\s+(\w+)/i);
      if (match) {
        tables.add(match[1]);
      }
    }
    return Array.from(tables).map((t) => `idx_${t}_missing`);
  }

  detectLockContention(): LockContention[] {
    const contention: LockContention[] = [];
    const tableAccess = new Map<string, number>();

    for (const log of this.queryLogs) {
      const match = log.sql.match(/(?:FROM|JOIN|UPDATE|DELETE|INSERT INTO)\s+(\w+)/i);
      if (match) {
        const table = match[1];
        const curr = tableAccess.get(table) || 0;
        tableAccess.set(table, curr + 1);
      }
    }

    for (const [table, accessCount] of tableAccess) {
      if (accessCount > 10) {
        contention.push({ table, waitTime: accessCount * 5 });
      }
    }

    return contention;
  }

  getDatabaseGrowth(): { size: number; growthRate: number } {
    const totalDuration = this.queryLogs.reduce((sum, l) => sum + l.duration, 0);
    return {
      size: this.queryLogs.length * 1000,
      growthRate: this.queryLogs.length > 0 ? totalDuration / this.queryLogs.length : 0,
    };
  }

  recommendOptimizations(): string[] {
    const recommendations: string[] = [];
    const slowQueries = this.getSlowQueries(200);
    if (slowQueries.length > 0) {
      recommendations.push("Add indexes for tables with frequent slow queries");
    }
    const contention = this.detectLockContention();
    if (contention.length > 0) {
      recommendations.push("Optimize transaction isolation levels to reduce lock contention");
    }
    const missingIndexes = this.detectMissingIndexes();
    if (missingIndexes.length > 0) {
      recommendations.push(`Consider creating indexes: ${missingIndexes.join(", ")}`);
    }
    if (recommendations.length === 0) {
      recommendations.push("Database performance is within acceptable parameters");
    }
    return recommendations;
  }
}

import { PDIndex, PDIndexType } from "./types";
import { PDUniqueIdentifiers } from "./unique-identifiers";

export class PDIndexingStrategy {
  private indexes = new Map<string, PDIndex>();
  private usageStats = new Map<string, { scans: number; seeks: number; updates: number }>();
  private uids = new PDUniqueIdentifiers();

  createIndex(index: PDIndex): void {
    const id = index.name || this.uids.generateUUID();
    this.indexes.set(id, { ...index, name: id });
    this.usageStats.set(id, { scans: 0, seeks: 0, updates: 0 });
  }

  dropIndex(name: string): void {
    this.indexes.delete(name);
    this.usageStats.delete(name);
  }

  getIndexes(tableName: string): PDIndex[] {
    return Array.from(this.indexes.values()).filter((idx) => idx.tableName === tableName);
  }

  recommendIndexes(tableName: string): PDIndex[] {
    const recommendations: PDIndex[] = [];
    const existing = this.getIndexes(tableName);
    const existingColumns = new Set(existing.flatMap((idx) => idx.columns));

    const commonColumns = ["id", "projectId", "type", "createdDate", "updatedDate", "userId"];
    for (const col of commonColumns) {
      if (!existingColumns.has(col)) {
        recommendations.push({
          name: `idx_${tableName}_${col}`,
          tableName,
          columns: [col],
          type: "btree",
          unique: col === "id",
        });
      }
    }
    return recommendations;
  }

  getIndexUsage(name: string): { scans: number; seeks: number; updates: number } {
    return this.usageStats.get(name) || { scans: 0, seeks: 0, updates: 0 };
  }
}

import { PDEntityType, PDEntityRecord, PDTransactionResult } from "./types";
import { PDCoreEntities } from "./core-entities";
import { PDTransactionManagement } from "./transaction-management";

export class PDRepositoryLayer {
  private coreEntities: PDCoreEntities;
  private transactionManager: PDTransactionManagement;

  constructor(coreEntities: PDCoreEntities, transactionManager: PDTransactionManagement) {
    this.coreEntities = coreEntities;
    this.transactionManager = transactionManager;
  }

  create(entityType: PDEntityType, data: Record<string, unknown>): PDEntityRecord {
    return this.coreEntities.createRecord(entityType, data);
  }

  read(id: string): PDEntityRecord | undefined {
    return this.coreEntities.getRecord(id);
  }

  update(id: string, data: Record<string, unknown>): PDEntityRecord {
    this.coreEntities.updateRecord(id, data);
    const record = this.coreEntities.getRecord(id);
    if (!record) {
      throw new Error(`Record ${id} not found after update`);
    }
    return record;
  }

  delete(id: string): boolean {
    const record = this.coreEntities.getRecord(id);
    if (!record || record.isDeleted) return false;
    this.coreEntities.deleteRecord(id);
    return true;
  }

  query(
    criteria: Partial<Record<string, unknown>>,
    options?: { limit?: number; offset?: number; orderBy?: string }
  ): PDEntityRecord[] {
    const allTypes = this.coreEntities.getAllEntityTypes();
    const results: PDEntityRecord[] = [];

    for (const type of allTypes) {
      const id = `query_${type}`;
      const record = this.coreEntities.getRecord(id);
      if (!record) continue;

      let match = true;
      for (const [key, value] of Object.entries(criteria)) {
        if (record.data[key] !== value) {
          match = false;
          break;
        }
      }
      if (match && !record.isDeleted) {
        results.push(record);
      }
    }

    const sorted = options?.orderBy
      ? results.sort((a, b) => {
          const aVal = String(a.data[options.orderBy!]);
          const bVal = String(b.data[options.orderBy!]);
          if (aVal < bVal) return -1;
          if (aVal > bVal) return 1;
          return 0;
        })
      : results;

    const offset = options?.offset || 0;
    const limit = options?.limit || sorted.length;
    return sorted.slice(offset, offset + limit);
  }

  count(entityType: PDEntityType): number {
    let count = 0;
    for (const type of this.coreEntities.getAllEntityTypes()) {
      if (type === entityType) count++;
    }
    return count;
  }

  async transaction(fn: () => void): Promise<PDTransactionResult> {
    return this.transactionManager.executeAtomic([fn], "repository transaction");
  }
}

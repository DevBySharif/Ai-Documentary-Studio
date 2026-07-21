import { PDAuditEntry, PDEntityType } from "./types";
import { PDUniqueIdentifiers } from "./unique-identifiers";

export class PDAuditLog {
  private entries: PDAuditEntry[] = [];
  private uids = new PDUniqueIdentifiers();

  log(
    entityType: PDEntityType,
    entityId: string,
    action: string,
    userId: string,
    changes: Record<string, unknown>
  ): void {
    const entry: PDAuditEntry = {
      id: this.uids.generateUUID(),
      timestamp: new Date(),
      entityType,
      entityId,
      action,
      userId,
      changes,
      immutable: true,
    };
    this.entries.push(entry);
  }

  query(criteria: Partial<Pick<PDAuditEntry, "entityType" | "entityId" | "action" | "userId">>): PDAuditEntry[] {
    return this.entries.filter((entry) => {
      for (const [key, value] of Object.entries(criteria)) {
        if ((entry as unknown as Record<string, unknown>)[key] !== value) return false;
      }
      return true;
    });
  }

  getEntityHistory(entityId: string): PDAuditEntry[] {
    return this.entries.filter((e) => e.entityId === entityId);
  }

  getUserActions(userId: string): PDAuditEntry[] {
    return this.entries.filter((e) => e.userId === userId);
  }

  exportAuditLog(format: "json" | "csv"): string {
    if (format === "json") {
      return JSON.stringify(this.entries, null, 2);
    }
    const header = "id,timestamp,entityType,entityId,action,userId,changes\n";
    const rows = this.entries
      .map(
        (e) =>
          `${e.id},${e.timestamp.toISOString()},${e.entityType},${e.entityId},${e.action},${e.userId},"${JSON.stringify(e.changes).replace(/"/g, '""')}"`
      )
      .join("\n");
    return header + rows;
  }
}

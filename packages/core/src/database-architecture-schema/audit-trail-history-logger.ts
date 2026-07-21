import { AuditTrailRecord } from "./schema-types";

/**
 * Audit Trail History Logger (Vol 06 Part 03 - Section 22).
 * Records significant entity state changes (previous value, new value, user, timestamp, reason) for debugging & accountability.
 */
export class AuditTrailHistoryLogger {
  private auditLogs: AuditTrailRecord[] = [];

  public logAudit(
    entityUuid: string,
    entityType: string,
    previousValueObj: unknown,
    newValueObj: unknown,
    userId = "StudioUser",
    reason?: string
  ): AuditTrailRecord {
    const record: AuditTrailRecord = {
      auditId: `aud_${Math.random().toString(36).substring(2, 7)}`,
      entityUuid,
      entityType,
      previousValueJson: JSON.stringify(previousValueObj),
      newValueJson: JSON.stringify(newValueObj),
      userId,
      timestamp: new Date(),
      reason,
    };
    this.auditLogs.push(record);
    return record;
  }

  public getEntityAuditLogs(entityUuid: string): ReadonlyArray<AuditTrailRecord> {
    return this.auditLogs.filter((a) => a.entityUuid === entityUuid);
  }
}

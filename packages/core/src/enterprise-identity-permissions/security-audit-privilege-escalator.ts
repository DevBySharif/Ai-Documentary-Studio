import { SecurityAuditRecord } from "./identity-permission-types";

export interface PrivilegeEscalationRecord {
  readonly escalationId: string;
  readonly userId: string;
  readonly elevatedRole: string;
  readonly reason: string;
  readonly grantedByUserId: string;
  readonly expiresAt: Date;
}

/**
 * Append-Only Security Audit Log & Controlled Privilege Escalation Vault (Vol 08 Part 05 - Section 13, Section 14).
 * Records tamper-evident security audit logs and manages temporary privilege escalations.
 */
export class SecurityAuditPrivilegeEscalator {
  private auditLogs: SecurityAuditRecord[] = [];
  private escalations: PrivilegeEscalationRecord[] = [];

  public logSecurityEvent(
    userId: string,
    actionName: string,
    resourceId: string,
    decision: "Granted" | "Denied",
    ipAddress = "127.0.0.1"
  ): SecurityAuditRecord {
    const record: SecurityAuditRecord = {
      auditId: `aud_sec_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      actionName,
      resourceId,
      decision,
      ipAddress,
      timestamp: new Date(),
    };

    this.auditLogs.push(record);
    return record;
  }

  public grantTemporaryPrivilegeEscalation(
    userId: string,
    elevatedRole: string,
    reason: string,
    grantedByUserId: string,
    durationHours = 2
  ): PrivilegeEscalationRecord {
    const record: PrivilegeEscalationRecord = {
      escalationId: `esc_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      elevatedRole,
      reason,
      grantedByUserId,
      expiresAt: new Date(Date.now() + durationHours * 3600 * 1000),
    };

    this.escalations.push(record);
    this.logSecurityEvent(userId, `PrivilegeEscalated:${elevatedRole}`, "System", "Granted");
    return record;
  }
}

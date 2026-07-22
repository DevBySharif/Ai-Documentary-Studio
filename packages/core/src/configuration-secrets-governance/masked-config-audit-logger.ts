import { ConfigAuditRecord, ConfigCategoryType, ConfigPrecedenceTier } from "./config-secret-types";

/**
 * Sensitive Value Masking Audit Logger & Change Tracker (Vol 09 Part 04 - Section 13).
 * Records auditable administrative configuration changes while guaranteeing sensitive values (keys/passwords) are strictly masked in logs.
 */
export class MaskedConfigAuditLogger {
  private auditLogs: ConfigAuditRecord[] = [];

  public logConfigChange(
    keyName: string,
    modifiedByUserId: string,
    category: ConfigCategoryType,
    tier: ConfigPrecedenceTier,
    details: string
  ): ConfigAuditRecord {
    // Mask any accidental secret strings in details
    const maskedDetails = details.replace(/(key|password|secret|token)=["']?([^"'\s]+)["']?/gi, "$1=****");

    const record: ConfigAuditRecord = {
      auditId: `aud_cfg_${Math.random().toString(36).substring(2, 7)}`,
      keyName,
      modifiedByUserId,
      category,
      tier,
      maskedDetails,
      timestamp: new Date(),
    };

    this.auditLogs.push(record);
    return record;
  }
}

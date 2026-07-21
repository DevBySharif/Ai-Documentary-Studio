import { ConfigAuditEntry } from "./config-types";

/**
 * Dynamic Runtime Settings & Audit Logger (Vol 06 Part 08 - Section 18, Section 19).
 * Emits dynamic settings updates at runtime without restarting and logs audit entries.
 */
export class DynamicRuntimeSettingsNotifier {
  private auditHistory: ConfigAuditEntry[] = [];

  public logConfigChange(
    category: string,
    key: string,
    previousValue: unknown,
    newValue: unknown,
    changedBy = "StudioUser",
    source: ConfigAuditEntry["source"] = "Manual"
  ): ConfigAuditEntry {
    const entry: ConfigAuditEntry = {
      changeId: `cfg_chg_${Math.random().toString(36).substring(2, 7)}`,
      category,
      key,
      previousValueJson: JSON.stringify(previousValue),
      newValueJson: JSON.stringify(newValue),
      changedBy,
      timestamp: new Date(),
      source,
    };
    this.auditHistory.push(entry);
    return entry;
  }

  public getAuditHistory(): ReadonlyArray<ConfigAuditEntry> {
    return this.auditHistory;
  }
}

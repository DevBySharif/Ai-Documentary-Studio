import type { GovernanceRule, MasterAssetRecord } from "./types.js";

export class AssetGovernanceEngine {
  private rules = new Map<string, GovernanceRule>();

  addRule(rule: GovernanceRule): void {
    if (!rule?.ruleId) throw new Error("GovernanceRule with ruleId is required");
    this.rules.set(rule.ruleId, rule);
  }

  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  getRule(ruleId: string): GovernanceRule | undefined {
    return this.rules.get(ruleId);
  }

  evaluate(asset: MasterAssetRecord): { allowed: boolean; warnings: string[]; denied: string[] } {
    const warnings: string[] = [];
    const denied: string[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;
      const matches = this.matchesRule(asset, rule.matcher);
      if (matches) {
        if (rule.action === "deny") denied.push(rule.name);
        else if (rule.action === "warn") warnings.push(rule.name);
      }
    }

    return { allowed: denied.length === 0, warnings, denied };
  }

  private matchesRule(asset: MasterAssetRecord, matcher: Record<string, unknown>): boolean {
    for (const [key, value] of Object.entries(matcher)) {
      const assetValue = (asset as unknown as Record<string, unknown>)[key];
      if (Array.isArray(value) && Array.isArray(assetValue)) {
        if (!value.some((v) => (assetValue as unknown[]).includes(v))) return false;
      } else if (assetValue !== value) {
        return false;
      }
    }
    return true;
  }

  getAllRules(): GovernanceRule[] {
    return Array.from(this.rules.values());
  }
}

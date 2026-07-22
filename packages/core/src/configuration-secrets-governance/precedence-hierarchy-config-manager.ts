import { ConfigPrecedenceTier, ConfigCategoryType, EnvironmentProfileType } from "./config-secret-types";

/**
 * 6-Tier Configuration Precedence Hierarchy Resolver (Vol 09 Part 04 - Section 4, Section 5, Section 6).
 * Evaluates config precedence (`System Defaults → Deployment Profile → Organization → Workspace → Project → Runtime Override`).
 */
export class PrecedenceHierarchyConfigManager {
  private tierValues = new Map<ConfigPrecedenceTier, Map<string, unknown>>();

  constructor() {
    this.initDefaultTiers();
  }

  private initDefaultTiers(): void {
    const sysDefaults = new Map<string, unknown>([
      ["ai.defaultModel", "gpt-4o"],
      ["ai.tokenLimit", 4096],
      ["ui.theme", "dark"],
      ["security.sessionTimeoutMins", 60],
    ]);

    this.tierValues.set("SystemDefaults", sysDefaults);
    this.tierValues.set("RuntimeOverride", new Map<string, unknown>());
  }

  public setRuntimeOverride(key: string, value: unknown): void {
    const overrides = this.tierValues.get("RuntimeOverride");
    if (overrides) {
      overrides.set(key, value);
    }
  }

  public resolveConfigValue<T>(key: string): T | undefined {
    const precedence: ConfigPrecedenceTier[] = [
      "RuntimeOverride",
      "Project",
      "Workspace",
      "Organization",
      "DeploymentProfile",
      "SystemDefaults",
    ];

    for (const tier of precedence) {
      const map = this.tierValues.get(tier);
      if (map && map.has(key)) {
        return map.get(key) as T;
      }
    }

    return undefined;
  }
}

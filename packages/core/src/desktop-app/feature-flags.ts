import type { DAFeatureFlag } from "./types.js";

export class DAFeatureFlagSystem {
  private flags: Map<string, DAFeatureFlag> = new Map();

  register(key: string, description: string, enabled: boolean): void {
    this.flags.set(key, { key, enabled, description });
  }

  enable(key: string): void {
    const flag = this.flags.get(key);
    if (flag) flag.enabled = true;
  }

  disable(key: string): void {
    const flag = this.flags.get(key);
    if (flag) flag.enabled = false;
  }

  isEnabled(key: string): boolean {
    return this.flags.get(key)?.enabled ?? false;
  }

  getAllFlags(): DAFeatureFlag[] {
    return Array.from(this.flags.values());
  }

  clear(): void {
    this.flags.clear();
  }
}

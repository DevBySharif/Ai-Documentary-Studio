import type { DAAppConfig } from "./types.js";

export class DAConfigurationSystem {
  private config: DAAppConfig = {
    systemDefaults: {},
    userSettings: {},
    workspaceSettings: {},
    projectOverrides: {}
  };

  set(level: keyof DAAppConfig, values: Record<string, unknown>): void {
    this.config[level] = { ...this.config[level], ...values };
  }

  get(level: keyof DAAppConfig): Record<string, unknown> {
    return { ...this.config[level] };
  }

  getEffective(key: string): unknown {
    const priority: (keyof DAAppConfig)[] = ["projectOverrides", "workspaceSettings", "userSettings", "systemDefaults"];
    for (const level of priority) {
      if (key in this.config[level]) return this.config[level][key];
    }
    return undefined;
  }

  getAll(): DAAppConfig {
    return {
      systemDefaults: { ...this.config.systemDefaults },
      userSettings: { ...this.config.userSettings },
      workspaceSettings: { ...this.config.workspaceSettings },
      projectOverrides: { ...this.config.projectOverrides }
    };
  }
}

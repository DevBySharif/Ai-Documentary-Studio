import { ConfigResolutionLevel } from "./config-types";

/**
 * 5-Level Configuration Hierarchy Resolver (Vol 06 Part 08 - Section 3, Section 14, Section 17).
 * Resolves settings in priority order (`RuntimeOverride -> ProjectConfig -> UserPreferences -> ApplicationDefaults -> BuiltinDefaults`).
 */
export class ConfigHierarchyResolver {
  private runtimeOverrides = new Map<string, unknown>();
  private projectConfig = new Map<string, unknown>();
  private userPreferences = new Map<string, unknown>();
  private applicationDefaults = new Map<string, unknown>();
  private builtinDefaults = new Map<string, unknown>();

  constructor() {
    this.initBuiltinDefaults();
  }

  private initBuiltinDefaults(): void {
    this.builtinDefaults.set("theme", "Dark");
    this.builtinDefaults.set("loggingLevel", "Info");
    this.builtinDefaults.set("autosaveIntervalSecs", 60);
    this.builtinDefaults.set("frameRate", 24);
  }

  public resolveSetting<T = unknown>(key: string): { value: T; level: ConfigResolutionLevel } {
    if (this.runtimeOverrides.has(key)) return { value: this.runtimeOverrides.get(key) as T, level: "RuntimeOverride" };
    if (this.projectConfig.has(key)) return { value: this.projectConfig.get(key) as T, level: "ProjectConfig" };
    if (this.userPreferences.has(key)) return { value: this.userPreferences.get(key) as T, level: "UserPreferences" };
    if (this.applicationDefaults.has(key)) return { value: this.applicationDefaults.get(key) as T, level: "ApplicationDefaults" };

    return { value: this.builtinDefaults.get(key) as T, level: "BuiltinDefaults" };
  }

  public setRuntimeOverride(key: string, value: unknown): void {
    this.runtimeOverrides.set(key, value);
  }
}

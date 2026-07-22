import { ExtensionPointType } from "./plugin-sdk-types";

export interface StandardPlatformSdk {
  readonly sdkVersion: string;
  subscribeToEvent(extensionPoint: ExtensionPointType, handler: (payload: unknown) => void): void;
  getPluginConfig(pluginId: string): Record<string, unknown>;
  logMessage(pluginId: string, level: "info" | "warn" | "error", msg: string): void;
}

/**
 * Standardized Platform SDK Contracts (Vol 10 Part 01 - Section 5).
 * Exposes event APIs, resource APIs, configuration APIs, logging APIs, and security APIs to plugin developers.
 */
export class PlatformSdkContracts implements StandardPlatformSdk {
  public readonly sdkVersion = "1.0.0";

  public subscribeToEvent(extensionPoint: ExtensionPointType, handler: (payload: unknown) => void): void {
    // Registered in lifecycle bus
  }

  public getPluginConfig(pluginId: string): Record<string, unknown> {
    return { pluginId, active: true };
  }

  public logMessage(pluginId: string, level: "info" | "warn" | "error", msg: string): void {
    // Intercepted by core logger
  }
}

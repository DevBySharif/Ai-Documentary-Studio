import { PluginCapability, PluginManifest } from "./plugin-manifest";
import { PublicSdk } from "./public-sdk";

/**
 * Plugin Sandbox & Capability Guard (IB Part 22 - Section 10, Section 21, Section 22).
 * Denies undeclared capability calls automatically and isolates plugin failures.
 */
export class PluginSandbox {
  constructor(private readonly manifest: PluginManifest) {}

  public verifyCapability(required: PluginCapability): void {
    const granted = this.manifest.declaredCapabilities.includes(required);
    if (!granted) {
      throw new Error(
        `[PluginSandbox] Permission Denied: Plugin '${this.manifest.pluginId}' requested capability '${required}' which is not declared in its manifest.`
      );
    }
  }

  /**
   * Safe execution boundary wrapping plugin callbacks to prevent core instability.
   */
  public async executeSafely<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[PluginSandbox] Isolated failure in plugin '${this.manifest.pluginId}':`, msg);
      throw new Error(`Plugin '${this.manifest.pluginId}' failed gracefully: ${msg}`);
    }
  }
}

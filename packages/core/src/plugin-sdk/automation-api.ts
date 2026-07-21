import { PublicSdk } from "./public-sdk";

export type AutomationScriptFn = (sdk: PublicSdk) => Promise<void>;

/**
 * Automation API (IB Part 22 - Section 16, Section 24).
 * Automation scripts use the exact same public SDK surface as plugins.
 */
export class AutomationScriptExecutor {
  constructor(private readonly sdk: PublicSdk) {}

  public async executeScript(name: string, scriptFn: AutomationScriptFn): Promise<void> {
    this.sdk.logging.logInfo(`[Automation] Executing script: '${name}'`);
    try {
      await scriptFn(this.sdk);
      this.sdk.logging.logInfo(`[Automation] Script '${name}' completed successfully.`);
    } catch (err: unknown) {
      this.sdk.logging.logError(`[Automation] Script '${name}' failed.`, err);
      throw err;
    }
  }
}

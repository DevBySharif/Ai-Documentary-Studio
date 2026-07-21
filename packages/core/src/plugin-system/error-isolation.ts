export interface SafeExecutionResult {
  result: unknown;
  error?: string;
}

export class PLErrorIsolation {
  private failedPlugins = new Set<string>();

  executeSafely(pluginId: string, fn: () => unknown): SafeExecutionResult {
    try {
      const result = fn();
      return { result };
    } catch (err) {
      const message = (err as Error).message ?? String(err);
      this.failedPlugins.add(pluginId);
      return { result: null, error: message };
    }
  }

  disableOnFailure(pluginId: string): void {
    this.failedPlugins.add(pluginId);
  }

  getFailedPlugins(): string[] {
    return Array.from(this.failedPlugins);
  }

  recoverPlugin(pluginId: string): boolean {
    return this.failedPlugins.delete(pluginId);
  }
}

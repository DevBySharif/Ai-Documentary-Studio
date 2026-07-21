import { PLPluginManifest } from './types';

export class PLPluginSandbox {
  private sandboxes = new Map<string, boolean>();
  private allowedGlobals = new Set([
    'console', 'Math', 'JSON', 'Date', 'RegExp', 'Map', 'Set',
    'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise',
    'Error', 'TypeError', 'SyntaxError', 'parseInt', 'parseFloat',
    'isNaN', 'isFinite', 'setTimeout', 'clearTimeout',
  ]);

  createSandbox(pluginId: string): void {
    this.sandboxes.set(pluginId, true);
  }

  async execute(pluginId: string, fn: () => unknown): Promise<unknown> {
    if (!this.sandboxes.has(pluginId)) {
      throw new Error(`Sandbox not created for plugin: ${pluginId}`);
    }
    try {
      const result = await fn();
      return result;
    } catch (err) {
      throw new Error(`Sandbox execution failed for ${pluginId}: ${(err as Error).message}`);
    }
  }

  destroySandbox(pluginId: string): void {
    this.sandboxes.delete(pluginId);
  }

  isRestricted(pluginId: string): boolean {
    return this.sandboxes.has(pluginId);
  }
}

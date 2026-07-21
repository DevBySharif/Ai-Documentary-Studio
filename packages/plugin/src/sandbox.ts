import { PluginManifest } from './models';
import pino from 'pino';

const logger = pino({ name: 'plugin-sandbox' });

/**
 * Represents the isolated environment where plugin code runs.
 * In a full Electron/Node environment, this might use `vm2`, Web Workers, or `iframe` sandboxes.
 * For this structural blueprint, it enforces logical separation and holds the plugin instance.
 */
export class SandboxHost {
  private instance: any = null;

  constructor(private manifest: PluginManifest) {}

  /**
   * Loads the plugin code and executes its initialization lifecycle safely.
   */
  async boot(pluginCode: string, sdkIntance: any): Promise<void> {
    logger.info({ pluginId: this.manifest.pluginId }, 'Booting plugin in sandbox');

    try {
      // DANGEROUS IN PROD: eval is used here structurally to represent loading external code.
      // A real implementation uses Node.js `vm` module or Web Workers with message passing.
      const factory = new Function('sdk', `
        ${pluginCode};
        return typeof initializePlugin !== 'undefined' ? initializePlugin(sdk) : null;
      `);

      this.instance = factory(sdkIntance);
      
      if (!this.instance) {
        throw new Error('Plugin did not export initializePlugin(sdk)');
      }

    } catch (error) {
      logger.error({ pluginId: this.manifest.pluginId, error }, 'Plugin failed to boot');
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    if (this.instance && typeof this.instance.destroy === 'function') {
      try {
        await this.instance.destroy();
      } catch (error) {
        logger.warn({ pluginId: this.manifest.pluginId, error }, 'Plugin threw error during shutdown');
      }
    }
    this.instance = null;
  }
}

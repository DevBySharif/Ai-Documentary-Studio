import { PluginManager } from './manager';
import pino from 'pino';

const logger = pino({ name: 'plugin-engine-facade' });

export class PluginEngineFacade {
  private manager = new PluginManager();

  /**
   * Safe entry point for loading plugins into the host application.
   */
  async loadPlugin(rawManifest: unknown, pluginCode: string): Promise<string> {
    logger.info('Attempting to load plugin');
    return await this.manager.install(rawManifest, pluginCode);
  }

  /**
   * Safe entry point for removing plugins from the host application.
   */
  async removePlugin(pluginId: string): Promise<void> {
    logger.info({ pluginId }, 'Attempting to remove plugin');
    await this.manager.uninstall(pluginId);
  }

  getPluginStatus(pluginId: string): string | undefined {
    return this.manager.getStatus(pluginId);
  }
}

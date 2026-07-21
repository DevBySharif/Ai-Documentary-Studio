import { PluginManifest, PluginManifestSchema, PluginStatus } from './models';
import { SandboxHost } from './sandbox';
import { PermissionGateway } from './gateway';
import { PluginSDK } from './sdk';
import pino from 'pino';

const logger = pino({ name: 'plugin-manager' });

interface InstalledPlugin {
  manifest: PluginManifest;
  status: PluginStatus;
  sandbox?: SandboxHost;
}

export class PluginManager {
  private plugins = new Map<string, InstalledPlugin>();

  /**
   * Installs a plugin from raw JSON and source code.
   */
  async install(rawManifest: unknown, pluginCode: string): Promise<string> {
    try {
      // 1. Validation Phase
      const manifest = PluginManifestSchema.parse(rawManifest);
      
      if (this.plugins.has(manifest.pluginId)) {
        throw new Error(`Plugin ${manifest.pluginId} is already installed`);
      }

      logger.info({ pluginId: manifest.pluginId }, 'Validated plugin manifest');

      const installed: InstalledPlugin = {
        manifest,
        status: 'Installed'
      };

      this.plugins.set(manifest.pluginId, installed);

      // 2. Activation Phase
      await this.activate(manifest.pluginId, pluginCode);

      return manifest.pluginId;

    } catch (error) {
      logger.error({ error }, 'Failed to install plugin');
      throw error;
    }
  }

  private async activate(pluginId: string, pluginCode: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found`);

    try {
      // Create isolated security context
      const gateway = new PermissionGateway(plugin.manifest);
      const sdk = new PluginSDK(gateway, plugin.manifest.pluginId);
      
      // Create sandbox and boot
      const sandbox = new SandboxHost(plugin.manifest);
      await sandbox.boot(pluginCode, sdk);

      plugin.sandbox = sandbox;
      plugin.status = 'Active';
      logger.info({ pluginId }, 'Plugin activated successfully');

    } catch (error) {
      plugin.status = 'Failed';
      logger.error({ pluginId, error }, 'Failed to activate plugin. Suspending.');
      throw error;
    }
  }

  async uninstall(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    if (plugin.sandbox) {
      await plugin.sandbox.shutdown();
    }

    plugin.status = 'Removed';
    this.plugins.delete(pluginId);
    logger.info({ pluginId }, 'Plugin uninstalled');
  }

  getStatus(pluginId: string): PluginStatus | undefined {
    return this.plugins.get(pluginId)?.status;
  }
}

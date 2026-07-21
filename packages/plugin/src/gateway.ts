import { PluginManifest, Permission } from './models';
import pino from 'pino';

const logger = pino({ name: 'permission-gateway' });

export class PermissionGateway {
  constructor(private manifest: PluginManifest) {}

  /**
   * Asserts that the plugin has requested and been granted a specific permission.
   * Throws if permission is denied, acting as a hard boundary.
   */
  assert(permission: Permission): void {
    if (!this.manifest.permissions.includes(permission)) {
      logger.warn({ pluginId: this.manifest.pluginId, permission }, 'Permission denied');
      throw new Error(`Security Exception: Plugin ${this.manifest.pluginId} does not have the ${permission} permission.`);
    }
  }

  /**
   * Silently checks if a plugin has a permission (useful for filtering events).
   */
  has(permission: Permission): boolean {
    return this.manifest.permissions.includes(permission);
  }
}

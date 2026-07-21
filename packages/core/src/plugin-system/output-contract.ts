import { PLOutputContract, PLPluginStatus, PLPermission } from './types';

export class PLOutputContractBuilder {
  private plugin = '';
  private version = '';
  private status: PLPluginStatus = 'installed';
  private permissions: PLPermission[] = [];

  withPlugin(plugin: string): this {
    this.plugin = plugin;
    return this;
  }

  withVersion(version: string): this {
    this.version = version;
    return this;
  }

  withStatus(status: PLPluginStatus): this {
    this.status = status;
    return this;
  }

  withPermissions(permissions: PLPermission[]): this {
    this.permissions = [...permissions];
    return this;
  }

  build(): PLOutputContract {
    if (!this.plugin) throw new Error('plugin is required');
    if (!this.version) throw new Error('version is required');
    return {
      plugin: this.plugin,
      version: this.version,
      status: this.status,
      permissions: [...this.permissions],
    };
  }
}

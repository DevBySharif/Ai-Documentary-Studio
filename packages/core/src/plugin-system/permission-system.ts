import { PLPermission } from './types';

export class PLPermissionSystem {
  private permissions = new Map<string, Set<PLPermission>>();

  async requestPermission(pluginId: string, permission: PLPermission): Promise<boolean> {
    const granted = this.permissions.get(pluginId);
    if (granted?.has(permission)) return true;
    const allowed = await this.promptUser(pluginId, permission);
    if (allowed) {
      this.grantPermission(pluginId, permission);
    }
    return allowed;
  }

  grantPermission(pluginId: string, permission: PLPermission): void {
    if (!this.permissions.has(pluginId)) {
      this.permissions.set(pluginId, new Set());
    }
    this.permissions.get(pluginId)!.add(permission);
  }

  revokePermission(pluginId: string, permission: PLPermission): void {
    this.permissions.get(pluginId)?.delete(permission);
  }

  hasPermission(pluginId: string, permission: PLPermission): boolean {
    return this.permissions.get(pluginId)?.has(permission) ?? false;
  }

  getGrantedPermissions(pluginId: string): PLPermission[] {
    return Array.from(this.permissions.get(pluginId) ?? []);
  }

  private async promptUser(_pluginId: string, _permission: PLPermission): Promise<boolean> {
    return true;
  }
}

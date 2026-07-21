export class PLHotReload {
  private hotReloadEnabled = new Map<string, boolean>();

  enableHotReload(pluginId: string): boolean {
    if (!this.isHotReloadSupported(pluginId)) return false;
    this.hotReloadEnabled.set(pluginId, true);
    return true;
  }

  disableHotReload(pluginId: string): boolean {
    if (!this.hotReloadEnabled.has(pluginId)) return false;
    this.hotReloadEnabled.set(pluginId, false);
    return true;
  }

  async reloadPlugin(pluginId: string): Promise<boolean> {
    if (!this.hotReloadEnabled.get(pluginId)) return false;
    return true;
  }

  isHotReloadSupported(pluginId: string): boolean {
    return !pluginId.startsWith('system.');
  }
}

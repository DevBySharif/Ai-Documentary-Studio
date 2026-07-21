export class PLPluginStorage {
  private storage = new Map<string, Map<string, unknown>>();

  store(pluginId: string, key: string, value: unknown): void {
    if (!this.storage.has(pluginId)) {
      this.storage.set(pluginId, new Map());
    }
    this.storage.get(pluginId)!.set(key, value);
  }

  retrieve(pluginId: string, key: string): unknown {
    return this.storage.get(pluginId)?.get(key);
  }

  delete(pluginId: string, key: string): boolean {
    return this.storage.get(pluginId)?.delete(key) ?? false;
  }

  clearStorage(pluginId: string): void {
    this.storage.get(pluginId)?.clear();
  }

  getStorageUsage(pluginId: string): { keys: number; estimatedBytes: number } {
    const data = this.storage.get(pluginId);
    if (!data) return { keys: 0, estimatedBytes: 0 };
    let bytes = 0;
    for (const [k, v] of data) {
      bytes += new Blob([k]).size;
      bytes += new Blob([JSON.stringify(v)]).size;
    }
    return { keys: data.size, estimatedBytes: bytes };
  }
}

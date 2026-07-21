interface VersionEntry {
  version: string;
  apiCompat: string;
  breaking: string[];
}

export class PLPluginVersioning {
  private versions = new Map<string, VersionEntry[]>();

  registerVersion(pluginId: string, version: string, apiCompat: string): void {
    if (!this.versions.has(pluginId)) {
      this.versions.set(pluginId, []);
    }
    this.versions.get(pluginId)!.push({ version, apiCompat, breaking: [] });
  }

  checkCompatibility(pluginId: string, appVersion: string): boolean {
    const entries = this.versions.get(pluginId);
    if (!entries || entries.length === 0) return false;
    const latest = entries[entries.length - 1];
    return this.semverGte(appVersion, latest.apiCompat);
  }

  getVersion(pluginId: string): string {
    const entries = this.versions.get(pluginId);
    if (!entries || entries.length === 0) return '0.0.0';
    return entries[entries.length - 1].version;
  }

  getBreakingChanges(pluginId: string): string[] {
    const entries = this.versions.get(pluginId);
    if (!entries) return [];
    return entries.flatMap((e) => e.breaking);
  }

  private semverGte(a: string, b: string): boolean {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const va = pa[i] || 0;
      const vb = pb[i] || 0;
      if (va < vb) return false;
      if (va > vb) return true;
    }
    return true;
  }
}

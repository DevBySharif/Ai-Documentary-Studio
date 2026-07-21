export class PLPluginArchitecture {
  private layers: { layer: string; responsibility: string }[] = [
    { layer: 'Application', responsibility: 'Host application entry point and UI' },
    { layer: 'Plugin Manager', responsibility: 'Orchestrates lifecycle, permissions, and dependencies across all plugins' },
    { layer: 'Plugin Loader', responsibility: 'Discovers, loads, and validates plugin manifests and binaries' },
    { layer: 'Plugin Runtime', responsibility: 'Sandboxed execution environment with resource isolation' },
    { layer: 'Plugin API', responsibility: 'Stable public API surface exposed to plugin code' },
  ];

  getArchitecture(): { layer: string; responsibility: string }[] {
    return this.layers.map((l) => ({ ...l }));
  }

  validateArchitecture(): boolean {
    const required = ['Application', 'Plugin Manager', 'Plugin Loader', 'Plugin Runtime', 'Plugin API'];
    const present = new Set(this.layers.map((l) => l.layer));
    for (const r of required) {
      if (!present.has(r)) return false;
    }
    for (let i = 0; i < this.layers.length - 1; i++) {
      if (!this.layers[i].layer || !this.layers[i].responsibility) return false;
    }
    return true;
  }
}

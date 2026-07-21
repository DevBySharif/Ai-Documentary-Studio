import { PLPluginManifest, PLPluginCategory } from './types';

export class PLOfficialPluginMarketplace {
  private registry = new Map<string, { manifest: PLPluginManifest; verified: boolean; publisher: string; rating: number }>();

  registerPlugin(manifest: PLPluginManifest, verified: boolean, publisher: string, rating: number): void {
    this.registry.set(manifest.pluginId, { manifest: { ...manifest }, verified, publisher, rating });
  }

  browsePlugins(category?: PLPluginCategory): PLPluginManifest[] {
    const all = Array.from(this.registry.values());
    if (category) {
      return all.filter((e) => e.manifest.category === category).map((e) => ({ ...e.manifest }));
    }
    return all.map((e) => ({ ...e.manifest }));
  }

  async installPlugin(pluginId: string): Promise<boolean> {
    const entry = this.registry.get(pluginId);
    if (!entry) return false;
    return true;
  }

  async updatePlugin(pluginId: string): Promise<boolean> {
    const entry = this.registry.get(pluginId);
    if (!entry) return false;
    return true;
  }

  verifyPublisher(pluginId: string): { verified: boolean; publisher: string } {
    const entry = this.registry.get(pluginId);
    if (!entry) return { verified: false, publisher: '' };
    return { verified: entry.verified, publisher: entry.publisher };
  }

  getRating(pluginId: string): number {
    return this.registry.get(pluginId)?.rating ?? 0;
  }
}

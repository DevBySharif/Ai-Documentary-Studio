import { PLPluginManifest, PLPluginCategory, PLPermission } from './types';

const VALID_CATEGORIES: PLPluginCategory[] = [
  'ai_provider', 'image_provider', 'voice_provider', 'motion_engine',
  'effects_pack', 'subtitle_engine', 'export_target', 'analytics',
  'qa', 'workflow_automation', 'ui_extension', 'future',
];

const VALID_PERMISSIONS: PLPermission[] = [
  'read_project', 'write_assets', 'generate_images',
  'export_video', 'internet_access', 'gpu_access',
];

export class PLPluginManifestManager {
  private manifests = new Map<string, PLPluginManifest>();

  register(manifest: PLPluginManifest): void {
    const validation = this.validate(manifest);
    if (!validation.valid) {
      throw new Error(`Manifest validation failed: ${validation.errors.join('; ')}`);
    }
    this.manifests.set(manifest.pluginId, { ...manifest });
  }

  get(pluginId: string): PLPluginManifest | undefined {
    return this.manifests.get(pluginId);
  }

  validate(manifest: PLPluginManifest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!manifest.pluginId) errors.push('pluginId is required');
    if (!manifest.name) errors.push('name is required');
    if (!manifest.version) errors.push('version is required');
    if (!manifest.author) errors.push('author is required');
    if (!manifest.description) errors.push('description is required');
    if (!VALID_CATEGORIES.includes(manifest.category)) errors.push(`Invalid category: ${manifest.category}`);
    if (!manifest.apiVersion) errors.push('apiVersion is required');
    if (!manifest.minAppVersion) errors.push('minAppVersion is required');
    if (!Array.isArray(manifest.dependencies)) errors.push('dependencies must be an array');
    if (!Array.isArray(manifest.permissions)) errors.push('permissions must be an array');
    for (const p of manifest.permissions) {
      if (!VALID_PERMISSIONS.includes(p)) errors.push(`Invalid permission: ${p}`);
    }
    return { valid: errors.length === 0, errors };
  }

  getAll(): PLPluginManifest[] {
    return Array.from(this.manifests.values());
  }
}

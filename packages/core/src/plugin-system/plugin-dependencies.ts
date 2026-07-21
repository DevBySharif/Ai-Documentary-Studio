import { PLPluginDependency, PLPluginManifest } from './types';

export class PLPluginDependencies {
  private dependencies = new Map<string, PLPluginDependency[]>();
  private manifests = new Map<string, PLPluginManifest>();

  addDependency(pluginId: string, dep: PLPluginDependency): void {
    if (!this.dependencies.has(pluginId)) {
      this.dependencies.set(pluginId, []);
    }
    this.dependencies.get(pluginId)!.push({ ...dep });
  }

  resolveDependencies(pluginId: string): { resolved: string[]; missing: string[]; circular: string[] } {
    const resolved: string[] = [];
    const missing: string[] = [];
    const circular: string[] = [];
    const visited = new Set<string>();
    const stack = new Set<string>();

    const visit = (id: string): void => {
      if (stack.has(id)) {
        circular.push(id);
        return;
      }
      if (visited.has(id)) return;
      visited.add(id);
      stack.add(id);

      const deps = this.dependencies.get(id) ?? [];
      for (const dep of deps) {
        if (this.manifests.has(dep.pluginId)) {
          resolved.push(dep.pluginId);
          visit(dep.pluginId);
        } else if (!dep.optional) {
          missing.push(dep.pluginId);
        }
      }
      stack.delete(id);
    };

    visit(pluginId);
    return { resolved: [...new Set(resolved)], missing: [...new Set(missing)], circular: [...new Set(circular)] };
  }

  getDependencies(pluginId: string): PLPluginDependency[] {
    return [...(this.dependencies.get(pluginId) ?? [])];
  }

  validateDependencyGraph(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    for (const [pluginId] of this.dependencies) {
      const result = this.resolveDependencies(pluginId);
      if (result.missing.length > 0) {
        issues.push(`Plugin ${pluginId} has missing dependencies: ${result.missing.join(', ')}`);
      }
      if (result.circular.length > 0) {
        issues.push(`Plugin ${pluginId} has circular dependencies: ${result.circular.join(', ')}`);
      }
    }
    return { valid: issues.length === 0, issues };
  }
}

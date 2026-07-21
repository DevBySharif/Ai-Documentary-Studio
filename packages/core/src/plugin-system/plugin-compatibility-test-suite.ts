import { PLPluginManifestManager } from './plugin-manifest';
import { PLPluginLifecycle } from './plugin-lifecycle';
import { PLPermissionSystem } from './permission-system';
import { PLPluginEventSystem } from './event-system';
import { PLPluginDependencies } from './plugin-dependencies';
import { PLPluginPerformanceMonitor } from './plugin-performance-monitor';

export class PLPluginCompatibilityTestSuite {
  constructor(
    private manifestManager: PLPluginManifestManager,
    private lifecycle: PLPluginLifecycle,
    private permissionSystem: PLPermissionSystem,
    private eventSystem: PLPluginEventSystem,
    private dependencies: PLPluginDependencies,
    private performanceMonitor: PLPluginPerformanceMonitor,
  ) {}

  testAPICompatibility(pluginId: string): { passed: boolean; issues: string[] } {
    const manifest = this.manifestManager.get(pluginId);
    if (!manifest) return { passed: false, issues: ['Manifest not found'] };
    const issues: string[] = [];
    if (!manifest.apiVersion) issues.push('Missing apiVersion');
    if (!manifest.minAppVersion) issues.push('Missing minAppVersion');
    if (manifest.dependencies.some((d) => !d.version)) issues.push('Dependency missing version');
    return { passed: issues.length === 0, issues };
  }

  testPermissionCompliance(pluginId: string): boolean {
    const manifest = this.manifestManager.get(pluginId);
    if (!manifest) return false;
    for (const perm of manifest.permissions) {
      if (!this.permissionSystem.hasPermission(pluginId, perm)) return false;
    }
    return true;
  }

  testPerformanceImpact(pluginId: string): { cpu: number; memory: number; gpu: number } {
    const report = this.performanceMonitor.getPerformanceReport(pluginId) as Record<string, number>;
    return {
      cpu: report.avgCPU ?? 0,
      memory: report.avgMemory ?? 0,
      gpu: report.avgGPU ?? 0,
    };
  }

  testEventHandling(pluginId: string): boolean {
    const events = ['project_opened', 'script_generated'] as const;
    for (const event of events) {
      const subscribers = this.eventSystem.getSubscribers(event);
      if (subscribers.includes(pluginId)) return true;
    }
    return false;
  }

  testResourceUsage(pluginId: string): { heap: number } {
    return { heap: 0 };
  }

  testDependencyConflicts(pluginId: string): boolean {
    const result = this.dependencies.resolveDependencies(pluginId);
    return result.missing.length === 0 && result.circular.length === 0;
  }

  runAllTests(pluginId: string): { compatible: boolean; report: Record<string, unknown> } {
    const api = this.testAPICompatibility(pluginId);
    const permission = this.testPermissionCompliance(pluginId);
    const events = this.testEventHandling(pluginId);
    const dependency = this.testDependencyConflicts(pluginId);
    const performance = this.testPerformanceImpact(pluginId);

    const compatible = api.passed && permission && events && dependency;
    return {
      compatible,
      report: {
        apiCompatibility: api,
        permissionCompliance: permission,
        eventHandling: events,
        dependencyConflicts: dependency,
        performanceImpact: performance,
      },
    };
  }
}

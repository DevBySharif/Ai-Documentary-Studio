import { PLPluginStatus } from './types';

const TRANSITION_MAP: Record<PLPluginStatus, PLPluginStatus[]> = {
  installed: ['validated'],
  validated: ['loaded'],
  loaded: ['initialized'],
  initialized: ['running'],
  running: ['disabled'],
  disabled: ['unloaded'],
  unloaded: ['removed'],
  removed: [],
};

const REVERSE_MAP: Record<PLPluginStatus, PLPluginStatus | null> = {
  installed: null,
  validated: 'installed',
  loaded: 'validated',
  initialized: 'loaded',
  running: 'initialized',
  disabled: 'running',
  unloaded: 'disabled',
  removed: 'unloaded',
};

export class PLPluginLifecycle {
  private statuses = new Map<string, PLPluginStatus>();

  transition(pluginId: string, targetStatus: PLPluginStatus): boolean {
    const current = this.statuses.get(pluginId) ?? 'installed';
    if (!this.canTransition(current, targetStatus)) return false;
    this.statuses.set(pluginId, targetStatus);
    return true;
  }

  getStatus(pluginId: string): PLPluginStatus {
    return this.statuses.get(pluginId) ?? 'installed';
  }

  canTransition(current: PLPluginStatus, target: PLPluginStatus): boolean {
    const fwd = TRANSITION_MAP[current];
    if (fwd?.includes(target)) return true;
    const rev = REVERSE_MAP[current];
    return rev === target;
  }

  getValidTransitions(current: PLPluginStatus): PLPluginStatus[] {
    const fwd = TRANSITION_MAP[current] ?? [];
    const rev = REVERSE_MAP[current];
    const result = [...fwd];
    if (rev) result.push(rev);
    return result;
  }
}

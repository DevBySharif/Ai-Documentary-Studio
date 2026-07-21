import { ASSettingsLevel } from './types';

const LEVEL_ORDER: ASSettingsLevel[] = [
  'system',
  'application',
  'workspace',
  'channel',
  'project',
  'scene',
];

export class ASSettingsHierarchy {
  private store = new Map<ASSettingsLevel, Map<string, unknown>>();

  constructor() {
    for (const level of LEVEL_ORDER) {
      this.store.set(level, new Map());
    }
  }

  set(level: ASSettingsLevel, key: string, value: unknown): void {
    const levelMap = this.store.get(level);
    if (levelMap) {
      levelMap.set(key, value);
    }
  }

  get(key: string): unknown | undefined {
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
      const levelMap = this.store.get(LEVEL_ORDER[i]);
      if (levelMap && levelMap.has(key)) {
        return levelMap.get(key);
      }
    }
    return undefined;
  }

  getAtLevel(level: ASSettingsLevel, key: string): unknown | undefined {
    const levelMap = this.store.get(level);
    return levelMap ? levelMap.get(key) : undefined;
  }

  resolveHierarchy(key: string): { level: ASSettingsLevel; value: unknown } | undefined {
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
      const levelMap = this.store.get(LEVEL_ORDER[i]);
      if (levelMap && levelMap.has(key)) {
        return { level: LEVEL_ORDER[i], value: levelMap.get(key) };
      }
    }
    return undefined;
  }

  clearLevel(level: ASSettingsLevel): void {
    const levelMap = this.store.get(level);
    if (levelMap) {
      levelMap.clear();
    }
  }

  getAllAtLevel(level: ASSettingsLevel): Record<string, unknown> {
    const levelMap = this.store.get(level);
    if (!levelMap) return {};
    const result: Record<string, unknown> = {};
    for (const [key, value] of levelMap) {
      result[key] = value;
    }
    return result;
  }

  getAllFlattened(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const seen = new Set<string>();
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
      const levelMap = this.store.get(LEVEL_ORDER[i]);
      if (levelMap) {
        for (const [key, value] of levelMap) {
          if (!seen.has(key)) {
            result[key] = value;
            seen.add(key);
          }
        }
      }
    }
    return result;
  }
}

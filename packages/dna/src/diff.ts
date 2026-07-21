import { ChannelDNA } from './schema';

export interface DNADiffResult {
  added: Record<string, any>;
  removed: Record<string, any>;
  changed: Record<string, { from: any; to: any }>;
}

export class DNADiffEngine {
  /**
   * Compares two DNA profiles and generates a detailed diff structure.
   * Useful for showing users what changes during an upgrade or inheritance.
   */
  static compare(base: ChannelDNA, updated: ChannelDNA): DNADiffResult {
    const result: DNADiffResult = {
      added: {},
      removed: {},
      changed: {},
    };

    this.compareObjects(base, updated, '', result);
    return result;
  }

  private static compareObjects(base: any, updated: any, path: string, result: DNADiffResult) {
    const allKeys = new Set([...Object.keys(base || {}), ...Object.keys(updated || {})]);

    for (const key of allKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      const baseVal = base ? base[key] : undefined;
      const upVal = updated ? updated[key] : undefined;

      if (baseVal === undefined && upVal !== undefined) {
        result.added[fullPath] = upVal;
      } else if (baseVal !== undefined && upVal === undefined) {
        result.removed[fullPath] = baseVal;
      } else if (typeof baseVal === 'object' && typeof upVal === 'object' && !Array.isArray(baseVal) && !Array.isArray(upVal)) {
        this.compareObjects(baseVal, upVal, fullPath, result);
      } else if (Array.isArray(baseVal) && Array.isArray(upVal)) {
        const sortedBase = [...baseVal].sort();
        const sortedUp = [...upVal].sort();
        if (JSON.stringify(sortedBase) !== JSON.stringify(sortedUp)) {
          result.changed[fullPath] = { from: baseVal, to: upVal };
        }
      } else if (baseVal !== upVal) {
        result.changed[fullPath] = { from: baseVal, to: upVal };
      }
    }
  }
}

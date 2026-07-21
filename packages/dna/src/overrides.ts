import { ChannelDNA } from './schema';
import { DNAInheritanceResolver } from './inheritance';

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export class DNAOverrideManager {
  /**
   * Applies temporary overrides to a base DNA (e.g. for a specific scene or project override).
   * Overrides do not permanently mutate the base DNA.
   */
  static applyOverrides(base: ChannelDNA, overrides: DeepPartial<ChannelDNA>): ChannelDNA {
    // We can cleverly re-use the inheritance resolver's merging logic since overrides act exactly like a child profile.
    // However, overrides might be partial, so we cast it up safely.
    
    // We map the DeepPartial to a structured fallback using base as the template structure
    const fauxChild = this.normalizePartial(overrides, base);
    return DNAInheritanceResolver.resolve(fauxChild as ChannelDNA, base);
  }

  private static normalizePartial(partial: any, base: any): any {
    const result: any = {};
    for (const key in base) {
      if (partial[key] === undefined) {
        // Omit if not overriding
        continue;
      }
      if (typeof partial[key] === 'object' && !Array.isArray(partial[key])) {
        result[key] = this.normalizePartial(partial[key], base[key]);
      } else {
        result[key] = partial[key];
      }
    }
    // ensure required IDs are preserved to bypass TS checks in the faux child before merge
    result.id = base.id;
    result.version = base.version;
    return result;
  }
}

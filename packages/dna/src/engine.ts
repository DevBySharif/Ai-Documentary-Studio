import { ChannelDNA } from './schema';
import { DNACompatibilityChecker } from './checker';
import { DNAInheritanceResolver } from './inheritance';
import { DNAOverrideManager, DeepPartial } from './overrides';
import { DNADiffEngine, DNADiffResult } from './diff';

export class DNAEngine {
  /**
   * Safe initialization of a DNA profile. Validates and resolves inheritance.
   */
  static activate(dnaConfig: unknown, parentDna?: ChannelDNA, requiredCapabilities: string[] = []): ChannelDNA {
    const { isValid, errors } = DNACompatibilityChecker.validate(dnaConfig, requiredCapabilities);
    if (!isValid) {
      throw new Error(`DNA Activation Failed:\n- ${errors.join('\n- ')}`);
    }

    return DNAInheritanceResolver.resolve(dnaConfig as ChannelDNA, parentDna);
  }

  /**
   * Generates a temporary DNA profile merged with scene/project overrides.
   */
  static applyOverrides(base: ChannelDNA, overrides: DeepPartial<ChannelDNA>): ChannelDNA {
    return DNAOverrideManager.applyOverrides(base, overrides);
  }

  /**
   * Compares two DNA profiles and outputs a diff result.
   */
  static compare(base: ChannelDNA, updated: ChannelDNA): DNADiffResult {
    return DNADiffEngine.compare(base, updated);
  }
}

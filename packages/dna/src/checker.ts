import { ChannelDNA, ChannelDNASchema } from './schema';
import pino from 'pino';

const logger = pino({ name: 'dna-compatibility-checker' });

export class DNACompatibilityChecker {
  /**
   * Validates a DNA package against schema requirements and required capabilities.
   */
  static validate(dna: unknown, requiredCapabilities: string[] = []): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // 1. Schema Validation
    const parsed = ChannelDNASchema.safeParse(dna);
    if (!parsed.success) {
      errors.push(...parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`));
      logger.error({ errors }, 'DNA failed schema validation');
      return { isValid: false, errors };
    }

    const validDNA = parsed.data;

    // 2. Capability Validation
    const missingCapabilities = requiredCapabilities.filter(
      cap => !validDNA.metadata.capabilities.includes(cap)
    );

    if (missingCapabilities.length > 0) {
      errors.push(`DNA is missing required capabilities: ${missingCapabilities.join(', ')}`);
      logger.error({ missingCapabilities }, 'DNA failed capability validation');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

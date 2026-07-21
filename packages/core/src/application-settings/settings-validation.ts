import { ASSettingsLevel } from './types';

export interface ASValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_LEVELS: ASSettingsLevel[] = [
  'system',
  'application',
  'workspace',
  'channel',
  'project',
  'scene',
];

export class ASSettingsValidation {
  validateType(key: string, value: unknown, expectedType: string): boolean {
    const actualType = typeof value;
    if (expectedType === 'array') {
      return Array.isArray(value);
    }
    if (expectedType === 'object') {
      return value !== null && !Array.isArray(value) && typeof value === 'object';
    }
    return actualType === expectedType;
  }

  validateRange(key: string, value: number, min: number, max: number): boolean {
    return typeof value === 'number' && value >= min && value <= max;
  }

  validateDependencyRules(key: string, value: unknown, allSettings: Record<string, unknown>): string[] {
    const errors: string[] = [];

    if (key === 'hardwareAcceleration' && value === true) {
      const gpuLimit = allSettings['gpuUsageLimit'];
      if (gpuLimit !== undefined && (gpuLimit as number) < 10) {
        errors.push('hardwareAcceleration requires gpuUsageLimit >= 10');
      }
    }

    if (key === 'backgroundRendering' && value === true) {
      const concurrentJobs = allSettings['concurrentJobs'];
      if (concurrentJobs !== undefined && (concurrentJobs as number) < 1) {
        errors.push('backgroundRendering requires concurrentJobs >= 1');
      }
    }

    if (key === 'workspaceEncryption' && value === true) {
      const apiKeyStorage = allSettings['apiKeyStorage'];
      if (apiKeyStorage === 'memory-only') {
        errors.push('workspaceEncryption incompatible with memory-only apiKeyStorage');
      }
    }

    if (key === 'offlineVoicePreference' && typeof value === 'object' && value !== null) {
      const pref = value as { enabled?: boolean };
      if (pref.enabled === true) {
        const outputFormat = allSettings['outputFormat'];
        if (outputFormat === 'aac') {
          errors.push('offlineVoicePreference requires outputFormat other than aac');
        }
      }
    }

    return errors;
  }

  validateProviderCompatibility(provider: string, settingKey: string, value: unknown): string[] {
    const errors: string[] = [];

    const providerSpecificValidations: Record<string, Record<string, (v: unknown) => string | null>> = {
      'openai': {
        'maxTokens': (v) => {
          if (typeof v === 'number' && (v < 1 || v > 16384)) {
            return 'openai maxTokens must be 1-16384';
          }
          return null;
        },
      },
      'dall-e': {
        'resolution': (v) => {
          const valid = ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'];
          if (!valid.includes(v as string)) {
            return `dall-e resolution must be one of: ${valid.join(', ')}`;
          }
          return null;
        },
      },
    };

    const validations = providerSpecificValidations[provider]?.[settingKey];
    if (validations) {
      const error = validations(value);
      if (error) errors.push(error);
    }

    return errors;
  }

  validate(key: string, value: unknown, allSettings: Record<string, unknown>): ASValidationResult {
    const errors: string[] = [];

    if (value === null || value === undefined) {
      errors.push(`${key} cannot be null or undefined`);
      return { valid: false, errors };
    }

    if (key === 'resolution' && typeof value === 'string') {
      const validPattern = /^\d+x\d+$/;
      if (!validPattern.test(value)) {
        errors.push('resolution must be in format WIDTHxHEIGHT (e.g. 1920x1080)');
      }
    }

    if (key === 'fps' && typeof value === 'number') {
      const validFps = [12, 15, 23.976, 24, 25, 29.97, 30, 48, 50, 60, 120, 144, 240];
      if (!validFps.some((f) => Math.abs(f - value) < 0.01)) {
        errors.push(`fps must be one of: ${validFps.join(', ')}`);
      }
    }

    if (key === 'uiScaling' && typeof value === 'number') {
      return { valid: false, errors: ['use validateRange for uiScaling'] };
    }

    if (key === 'level' && typeof value === 'string') {
      if (!VALID_LEVELS.includes(value as ASSettingsLevel)) {
        errors.push(`level must be one of: ${VALID_LEVELS.join(', ')}`);
      }
    }

    if (key === 'temperature' && typeof value === 'number') {
      if (value < 0 || value > 2) {
        errors.push('temperature must be between 0 and 2');
      }
    }

    const dependencyErrors = this.validateDependencyRules(key, value, allSettings);
    errors.push(...dependencyErrors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

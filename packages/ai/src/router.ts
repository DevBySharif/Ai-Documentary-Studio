import { AdapterRegistry } from './registry';
import { AIRequest } from './models';
import { IAIProvider } from './interfaces';
import pino from 'pino';

const logger = pino({ name: 'ai-provider-router' });

export class ProviderRouter {
  constructor(private registry: AdapterRegistry) {}

  /**
   * Selects the best provider based on capabilities and preferences.
   */
  route(request: AIRequest): IAIProvider {
    const candidates = this.registry.getProvidersByCapability(request.requiredCapabilities);

    if (candidates.length === 0) {
      throw new Error(`No providers available for capabilities: ${request.requiredCapabilities.join(', ')}`);
    }

    // If explicit preference is provided and matches capabilities, use it
    if (request.providerPreference) {
      const preferred = candidates.find(p => p.name === request.providerPreference);
      if (preferred) {
        logger.debug({ provider: preferred.name }, 'Selected preferred provider');
        return preferred;
      }
    }

    // Fallback: Pick the first available candidate (can be extended with cost/latency policy sorting)
    const selected = candidates[0];
    logger.debug({ provider: selected.name }, 'Selected fallback provider via capability routing');
    return selected;
  }

  /**
   * Get an ordered list of providers for fallback execution.
   */
  getFallbackChain(request: AIRequest): IAIProvider[] {
    const candidates = this.registry.getProvidersByCapability(request.requiredCapabilities);
    
    if (request.providerPreference) {
      const preferred = candidates.find(p => p.name === request.providerPreference);
      if (preferred) {
        // Move preferred to the front
        return [preferred, ...candidates.filter(p => p.name !== request.providerPreference)];
      }
    }
    
    return candidates;
  }
}

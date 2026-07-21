import { AIRequest, AIResponse, AICapability } from './models';
import { ProviderRouter } from './router';
import { RetryManager } from './retry';
import { ResponseValidator } from './validator';
import pino from 'pino';

const logger = pino({ name: 'ai-orchestrator' });

export class AIOrchestrator {
  constructor(private router: ProviderRouter) {}

  /**
   * Main entry point for all AI interactions.
   * Handles routing, retries, fallback chaining, and base normalization.
   */
  async execute(request: AIRequest): Promise<AIResponse> {
    const fallbackChain = this.router.getFallbackChain(request);
    
    if (fallbackChain.length === 0) {
      throw new Error('No providers available to satisfy this request.');
    }

    let lastError: any = null;

    for (const provider of fallbackChain) {
      try {
        logger.info({ requestId: request.id, provider: provider.name }, 'Attempting execution');
        
        const response = await RetryManager.executeWithRetry(
          () => provider.generate(request),
          request.retryPolicy?.maxRetries,
          request.retryPolicy?.backoffMs
        );
        
        logger.info({ requestId: request.id, provider: provider.name, cost: response.usage.estimatedCostUsd }, 'Execution successful');
        return response;

      } catch (error: any) {
        lastError = error;
        logger.warn({ requestId: request.id, provider: provider.name, error: error.message }, 'Provider failed, moving to fallback if available');
      }
    }

    // If we exhaust the chain, throw the last error
    logger.error({ requestId: request.id, error: lastError }, 'All providers in fallback chain failed');
    throw new Error(`AI Orchestration Failed after trying ${fallbackChain.length} providers. Last error: ${lastError?.message}`);
  }

  /**
   * Streams a response from the best available provider.
   * Fallback is not supported mid-stream yet.
   */
  async *stream(request: AIRequest): AsyncIterableIterator<string> {
    const provider = this.router.route(request);
    
    if (!provider.capabilities.has(AICapability.Streaming)) {
      throw new Error(`Selected provider ${provider.name} does not support streaming`);
    }

    logger.info({ requestId: request.id, provider: provider.name }, 'Starting stream');

    try {
      yield* provider.stream(request);
    } catch (error: any) {
      logger.error({ requestId: request.id, provider: provider.name, error: error.message }, 'Stream failed');
      throw error;
    }
  }

  /**
   * Helper to execute and parse structured JSON output.
   */
  async executeStructured<T>(request: AIRequest, schema: any): Promise<T> {
    // Force JSON capability requirement
    const jsonReq = { ...request, requiredCapabilities: [...request.requiredCapabilities, AICapability.JSONMode] };
    const response = await this.execute(jsonReq);
    
    if (response.json) {
       return ResponseValidator.validate(response.json, schema);
    } else if (response.text) {
       const parsed = ResponseValidator.extractAndParseJSON(response.text);
       return ResponseValidator.validate(parsed, schema);
    }

    throw new Error('No text or JSON payload returned from provider');
  }
}

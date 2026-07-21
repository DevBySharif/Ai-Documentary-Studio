import { AIRequest, AIResponse, AICapability } from './models';

export interface IAIProvider {
  /**
   * The unique identifier for this provider (e.g., 'gemini', 'openai')
   */
  readonly name: string;

  /**
   * Set of capabilities this provider adapter supports.
   */
  readonly capabilities: Set<AICapability>;

  /**
   * Standard generation call returning a normalized response.
   */
  generate(request: AIRequest): Promise<AIResponse>;

  /**
   * Streaming generation call, yielding partial texts.
   */
  stream(request: AIRequest): AsyncIterableIterator<string>;

  /**
   * Returns a rough cost estimate for the given request parameters.
   */
  estimateCost(request: AIRequest): number;

  /**
   * Check if the provider is healthy and reachable.
   */
  healthCheck(): Promise<boolean>;
}

import { IAIProvider } from '../interfaces';
import { AIRequest, AIResponse, AICapability } from '../models';
import { randomUUID } from 'crypto';

export class MockProvider implements IAIProvider {
  readonly name = 'mock-provider';
  
  readonly capabilities = new Set([
    AICapability.TextGeneration,
    AICapability.JSONMode,
    AICapability.Streaming,
  ]);

  async generate(request: AIRequest): Promise<AIResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let payload = 'This is a mock response from the MockProvider.';
    let json: any = undefined;

    if (request.requiredCapabilities.includes(AICapability.JSONMode)) {
      json = { status: 'mock-success', data: 'mock-data' };
      payload = JSON.stringify(json);
    }

    return {
      requestId: request.id,
      provider: this.name,
      model: request.modelPreference || 'mock-model-v1',
      text: payload,
      json: json,
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
        estimatedCostUsd: 0.001,
      },
      finishReason: 'stop',
      safetyStatus: 'safe',
    };
  }

  async *stream(request: AIRequest): AsyncIterableIterator<string> {
    const words = ['This', ' is', ' a', ' mock', ' stream', '.'];
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100));
      yield word;
    }
  }

  estimateCost(request: AIRequest): number {
    return 0.001;
  }

  async healthCheck(): Promise<boolean> {
    return true; // Always healthy
  }
}

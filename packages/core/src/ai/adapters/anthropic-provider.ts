import {
  AIProvider,
  ProviderHealthStatus,
  TextGenerationOptions,
  TextGenerationResult,
  ImageGenerationOptions,
  ImageGenerationResult,
  SpeechGenerationOptions,
  SpeechGenerationResult
} from '../ai-provider.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  readonly supportedModels = ['claude-3-5-sonnet-20240620', 'claude-3-haiku-20240307'];

  private getApiKey(options?: { apiKey?: string }): string | undefined {
    return options?.apiKey || process.env.ANTHROPIC_API_KEY;
  }

  async isHealthy(): Promise<ProviderHealthStatus> {
    const key = this.getApiKey();
    return {
      providerName: this.name,
      isAvailable: Boolean(key && key.trim().length > 0),
      hasApiKey: Boolean(key && key.trim().length > 0),
      latencyMs: key ? 30 : -1,
      lastChecked: new Date()
    };
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult> {
    const startTime = Date.now();
    const apiKey = this.getApiKey(options);

    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(`[AnthropicProvider] ANTHROPIC_API_KEY is not set in environment or request options.`);
    }

    const model = options?.model || 'claude-3-5-sonnet-20240620';

    const payload: Record<string, any> = {
      model,
      max_tokens: options?.maxTokens ?? 2048,
      messages: [{ role: 'user', content: prompt }]
    };

    if (options?.systemPrompt) {
      payload.system = options.systemPrompt;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const latencyMs = Date.now() - startTime;
    const rawHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      if (key.startsWith('anthropic-') || key.startsWith('x-') || key === 'content-type') {
        rawHeaders[key] = val;
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Anthropic API Error ${response.status} ${response.statusText}]: ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.content?.[0]?.text || '';
    const promptTokens = data.usage?.input_tokens || 0;
    const completionTokens = data.usage?.output_tokens || 0;
    const totalTokens = promptTokens + completionTokens;

    // Cost estimation for Claude 3.5 Sonnet: $0.003 per 1k input tokens, $0.015 per 1k output tokens
    const costEstimateUsd = (promptTokens / 1000) * 0.003 + (completionTokens / 1000) * 0.015;

    return {
      text: generatedText,
      provider: this.name,
      model,
      latencyMs,
      costEstimateUsd,
      responseId: data.id || `msg-${Date.now()}`,
      rawHeaders,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens
      }
    };
  }

  async generateImage(_prompt: string, _options?: ImageGenerationOptions): Promise<ImageGenerationResult> {
    throw new Error(
      '[AnthropicProvider] generateImage() is NOT IMPLEMENTED. Anthropic does not provide an image generation API (NOT in Sprint 3 scope).'
    );
  }

  async generateSpeech(_text: string, _options?: SpeechGenerationOptions): Promise<SpeechGenerationResult> {
    throw new Error(
      '[AnthropicProvider] generateSpeech() is NOT IMPLEMENTED. Anthropic does not provide a speech synthesis API (NOT in Sprint 3 scope).'
    );
  }
}

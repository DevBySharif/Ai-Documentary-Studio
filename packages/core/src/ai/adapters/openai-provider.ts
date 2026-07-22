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

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  readonly supportedModels = ['gpt-4o', 'gpt-4o-mini', 'dall-e-3', 'tts-1-hd'];

  private getApiKey(options?: { apiKey?: string }): string | undefined {
    return options?.apiKey || process.env.OPENAI_API_KEY;
  }

  async isHealthy(): Promise<ProviderHealthStatus> {
    const key = this.getApiKey();
    return {
      providerName: this.name,
      isAvailable: Boolean(key && key.trim().length > 0),
      hasApiKey: Boolean(key && key.trim().length > 0),
      latencyMs: key ? 25 : -1,
      lastChecked: new Date()
    };
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult> {
    const startTime = Date.now();
    const apiKey = this.getApiKey(options);

    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(`[OpenAIProvider] OPENAI_API_KEY is not set in environment or request options.`);
    }

    const model = options?.model || 'gpt-4o';
    const messages = [];

    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const payload = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const latencyMs = Date.now() - startTime;
    const rawHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      if (key.startsWith('x-') || key.startsWith('openai-') || key === 'content-type') {
        rawHeaders[key] = val;
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[OpenAI API Error ${response.status} ${response.statusText}]: ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || '';
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;
    const totalTokens = data.usage?.total_tokens || 0;

    // Cost estimation for gpt-4o: $0.0025 per 1k input tokens, $0.010 per 1k output tokens
    const costEstimateUsd = (promptTokens / 1000) * 0.0025 + (completionTokens / 1000) * 0.010;

    return {
      text: generatedText,
      provider: this.name,
      model,
      latencyMs,
      costEstimateUsd,
      responseId: data.id || `chatcmpl-${Date.now()}`,
      rawHeaders,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens
      }
    };
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    const apiKey = this.getApiKey(options);

    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(`[OpenAIProvider] OPENAI_API_KEY is not set for DALL-E image generation.`);
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: options?.aspectRatio === '16:9' ? '1792x1024' : '1024x1024'
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[OpenAI DALL-E Error ${response.status}]: ${err}`);
    }

    const data = await response.json();
    const url = data.data?.[0]?.url || '';

    return {
      url,
      prompt,
      provider: this.name,
      width: options?.aspectRatio === '16:9' ? 1792 : 1024,
      height: 1024,
      latencyMs,
      costEstimateUsd: 0.040
    };
  }

  async generateSpeech(text: string, options?: SpeechGenerationOptions): Promise<SpeechGenerationResult> {
    const startTime = Date.now();
    const apiKey = this.getApiKey(options);

    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(`[OpenAIProvider] OPENAI_API_KEY is not set for TTS generation.`);
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        voice: options?.voiceId || 'alloy',
        input: text
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[OpenAI TTS Error ${response.status}]: ${err}`);
    }

    const buffer = await response.arrayBuffer();

    return {
      audioBuffer: buffer,
      durationMs: text.length * 80,
      provider: this.name,
      voiceId: options?.voiceId || 'alloy',
      latencyMs,
      costEstimateUsd: (text.length / 1000) * 0.030
    };
  }
}

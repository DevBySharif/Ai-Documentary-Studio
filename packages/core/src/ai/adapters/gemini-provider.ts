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

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  readonly supportedModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'imagen-3'];

  private getApiKey(options?: { apiKey?: string }): string | undefined {
    return options?.apiKey || process.env.GEMINI_API_KEY;
  }

  async isHealthy(): Promise<ProviderHealthStatus> {
    const key = this.getApiKey();
    return {
      providerName: this.name,
      isAvailable: Boolean(key && key.trim().length > 0),
      hasApiKey: Boolean(key && key.trim().length > 0),
      latencyMs: key ? 20 : -1,
      lastChecked: new Date()
    };
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult> {
    const startTime = Date.now();
    const apiKey = this.getApiKey(options);

    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(`[GeminiProvider] GEMINI_API_KEY is not set in environment or request options.`);
    }

    const model = options?.model || 'gemini-1.5-pro';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    const contents = [];
    if (options?.systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: `System Instruction: ${options.systemPrompt}` }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const payload = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const latencyMs = Date.now() - startTime;
    const rawHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      if (key.startsWith('x-') || key === 'content-type') {
        rawHeaders[key] = val;
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Gemini API Error ${response.status} ${response.statusText}]: ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const generatedText = candidate?.content?.parts?.map((p: any) => p.text).join('') || '';

    const promptTokens = data.usageMetadata?.promptTokenCount || 0;
    const completionTokens = data.usageMetadata?.candidatesTokenCount || 0;
    const totalTokens = data.usageMetadata?.totalTokenCount || (promptTokens + completionTokens);

    // Cost estimation for gemini-1.5-pro: $0.00125 per 1k input tokens, $0.005 per 1k output tokens
    const costEstimateUsd = (promptTokens / 1000) * 0.00125 + (completionTokens / 1000) * 0.005;

    return {
      text: generatedText,
      provider: this.name,
      model,
      latencyMs,
      costEstimateUsd,
      responseId: `gemini-${Date.now()}`,
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
      throw new Error(`[GeminiProvider] GEMINI_API_KEY is not set for Imagen generation.`);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:predict?key=${apiKey.trim()}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: options?.aspectRatio || '16:9' }
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[Gemini Imagen Error ${response.status}]: ${err}`);
    }

    const data = await response.json();

    if (!data.predictions?.[0]?.bytesBase64Encoded) {
      throw new Error(`[GeminiProvider] Imagen API returned no image data. Raw response: ${JSON.stringify(data)}`);
    }

    return {
      url: `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`,
      prompt,
      provider: this.name,
      width: 1920,
      height: 1080,
      latencyMs,
      costEstimateUsd: 0.030
    };
  }

  async generateSpeech(_text: string, _options?: SpeechGenerationOptions): Promise<SpeechGenerationResult> {
    throw new Error(
      '[GeminiProvider] generateSpeech() is NOT IMPLEMENTED. Google Cloud Text-to-Speech requires a separate API integration (NOT in Sprint 3 scope).'
    );
  }
}

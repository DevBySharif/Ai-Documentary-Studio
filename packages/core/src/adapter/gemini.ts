import type { AIProvider, AIProviderConfig, AIProviderRequest, AIProviderResponse } from "./types.js";

export class GeminiAdapter implements AIProvider {
  readonly name = "gemini";
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig = {}) {
    this.config = {
      model: "gemini-2.0-flash",
      temperature: 0.7,
      maxTokens: 8192,
      ...config,
    };
  }

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: request.temperature ?? this.config.temperature,
          maxOutputTokens: request.maxTokens ?? this.config.maxTokens,
        },
        contents: request.messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
      usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number };
    };

    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ?? "";

    return {
      content: text,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: data.usageMetadata.totalTokenCount,
          }
        : undefined,
      model: this.config.model as string,
    };
  }
}

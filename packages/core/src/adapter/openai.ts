import type { AIProvider, AIProviderConfig, AIProviderRequest, AIProviderResponse } from "./types.js";

export class OpenAIAdapter implements AIProvider {
  readonly name = "openai";
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig = {}) {
    this.config = {
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 4096,
      ...config,
    };
  }

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        temperature: request.temperature ?? this.config.temperature,
        max_tokens: request.maxTokens ?? this.config.maxTokens,
        response_format: request.responseFormat === "json_object"
          ? { type: "json_object" }
          : undefined,
        messages: [
          ...(request.system ? [{ role: "system", content: request.system }] : []),
          ...request.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      model: string;
    };

    return {
      content: data.choices[0]?.message?.content ?? "",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      model: data.model,
    };
  }
}

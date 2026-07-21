import type { AIProvider, AIProviderConfig, AIProviderRequest, AIProviderResponse } from "./types.js";

export class ClaudeAdapter implements AIProvider {
  readonly name = "claude";
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig = {}) {
    this.config = {
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      maxTokens: 8192,
      ...config,
    };
  }

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: request.maxTokens ?? this.config.maxTokens,
        temperature: request.temperature ?? this.config.temperature,
        system: request.system,
        messages: request.messages.map((m) => ({
          role: m.role === "system" ? "user" : m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text: string }>;
      usage?: { input_tokens: number; output_tokens: number };
      model: string;
    };

    const text = data.content
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    return {
      content: text,
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
      model: data.model,
    };
  }
}

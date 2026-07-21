export type AiProviderName = "OpenAI" | "GoogleGemini" | "AnthropicClaude" | "LocalLLM";

export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly parametersSchema: Record<string, unknown>;
}

export interface ToolCall {
  readonly id: string;
  readonly name: string;
  readonly arguments: Record<string, unknown>;
}

export interface GenerationRequest {
  readonly model: string;
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly tools?: ReadonlyArray<ToolDefinition>;
}

export interface GenerationResponse {
  readonly text: string;
  readonly toolCalls?: ReadonlyArray<ToolCall>;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly finishReason: "stop" | "tool_calls" | "length" | "error";
}

export interface StreamChunk {
  readonly textDelta: string;
  readonly isComplete: boolean;
}

/**
 * Universal Provider Contract (IB Part 18 - Section 4, Section 22).
 * All providers (OpenAI, Gemini, Claude, Local LLMs) implement this interface.
 */
export interface AiProvider {
  readonly providerName: AiProviderName;
  generate(request: GenerationRequest): Promise<GenerationResponse>;
  generateStream(
    request: GenerationRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<GenerationResponse>;
}

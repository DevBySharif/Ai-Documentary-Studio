import type { APProviderName, APCapability } from "./types.js";

export interface APProviderInterface {
  name: APProviderName;
  generate(prompt: string, options: Record<string, unknown>): Promise<string>;
  stream?(prompt: string, options: Record<string, unknown>): AsyncIterable<string>;
  isAvailable(): boolean;
  getCapabilities(): APCapability[];
}

export class APGeminiAdapter implements APProviderInterface {
  name: APProviderName = "gemini";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "gemini_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation", "vision", "structured_json", "long_context", "streaming"];
  }
}

export class APOpenAIAdapter implements APProviderInterface {
  name: APProviderName = "openai";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "openai_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation", "vision", "structured_json", "function_calling", "streaming"];
  }
}

export class APClaudeAdapter implements APProviderInterface {
  name: APProviderName = "claude";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "claude_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation", "structured_json", "reasoning", "long_context"];
  }
}

export class APOpenRouterAdapter implements APProviderInterface {
  name: APProviderName = "openrouter";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "openrouter_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation", "streaming"];
  }
}

export class APOllamaAdapter implements APProviderInterface {
  name: APProviderName = "ollama";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "ollama_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation", "structured_json", "streaming"];
  }
}

export class APLMStudioAdapter implements APProviderInterface {
  name: APProviderName = "lm_studio";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "lm_studio_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation"];
  }
}

export class APGoogleAIStudioAdapter implements APProviderInterface {
  name: APProviderName = "google_ai_studio";

  async generate(_prompt: string, _options: Record<string, unknown>): Promise<string> {
    return "google_ai_studio_response";
  }

  isAvailable(): boolean {
    return true;
  }

  getCapabilities(): APCapability[] {
    return ["text_generation", "vision", "streaming"];
  }
}

export class APProviderAbstraction {
  private adapters: Map<APProviderName, APProviderInterface> = new Map();

  constructor() {
    this.register(new APGeminiAdapter());
    this.register(new APOpenAIAdapter());
    this.register(new APClaudeAdapter());
    this.register(new APOpenRouterAdapter());
    this.register(new APOllamaAdapter());
    this.register(new APLMStudioAdapter());
    this.register(new APGoogleAIStudioAdapter());
  }

  register(adapter: APProviderInterface): void {
    this.adapters.set(adapter.name, adapter);
  }

  get(name: APProviderName): APProviderInterface | undefined {
    return this.adapters.get(name);
  }

  getAvailable(): APProviderName[] {
    return Array.from(this.adapters.values()).filter((a) => a.isAvailable()).map((a) => a.name);
  }
}

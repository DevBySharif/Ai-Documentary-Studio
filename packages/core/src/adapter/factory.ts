import type { AIProvider, AIProviderConfig } from "./types.js";
import { OpenAIAdapter } from "./openai.js";
import { GeminiAdapter } from "./gemini.js";
import { ClaudeAdapter } from "./claude.js";

export type AIProviderType = "openai" | "gemini" | "claude";

export class AIProviderFactory {
  private providers = new Map<string, AIProvider>();
  private defaultType: AIProviderType = "openai";

  constructor() {
    this.providers.set("openai", new OpenAIAdapter());
    this.providers.set("gemini", new GeminiAdapter());
    this.providers.set("claude", new ClaudeAdapter());
  }

  create(type: AIProviderType, config?: AIProviderConfig): AIProvider {
    const key = config ? `${type}_${Date.now()}` : type;

    if (config) {
      const provider = this.newProvider(type, config);
      this.providers.set(key, provider);
      return provider;
    }

    const existing = this.providers.get(type);
    if (existing) return existing;

    const provider = this.newProvider(type);
    this.providers.set(key, provider);
    return provider;
  }

  get(type: AIProviderType): AIProvider {
    return this.create(type);
  }

  setDefault(type: AIProviderType): void {
    this.defaultType = type;
  }

  getDefault(): AIProvider {
    return this.get(this.defaultType);
  }

  private newProvider(type: AIProviderType, config?: AIProviderConfig): AIProvider {
    switch (type) {
      case "openai":
        return new OpenAIAdapter(config);
      case "gemini":
        return new GeminiAdapter(config);
      case "claude":
        return new ClaudeAdapter(config);
    }
  }
}

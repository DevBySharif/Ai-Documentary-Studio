import type { APRouteRule, APTaskType, APProviderName } from "./types.js";
import { APModelRegistry } from "./model-registry.js";

export class APTaskRouter {
  private routes: Map<APTaskType, APRouteRule> = new Map();
  private registry: APModelRegistry;

  constructor(registry: APModelRegistry) {
    this.registry = registry;
    this.setDefaults();
  }

  private setDefaults(): void {
    this.routes.set("script", { task: "script", provider: "gemini", model: "gemini-pro", fallback: ["claude", "openai"] });
    this.routes.set("prompt", { task: "prompt", provider: "openai", model: "gpt-4", fallback: ["gemini", "claude"] });
    this.routes.set("image_analysis", { task: "image_analysis", provider: "gemini", model: "gemini-pro-vision", fallback: ["openai"] });
    this.routes.set("qa", { task: "qa", provider: "claude", model: "claude-3", fallback: ["gemini", "openai"] });
    this.routes.set("topic_research", { task: "topic_research", provider: "openrouter", model: "mixtral", fallback: ["gemini"] });
  }

  setRoute(task: APTaskType, rule: APRouteRule): void {
    this.routes.set(task, rule);
  }

  getRoute(task: APTaskType): APRouteRule | undefined {
    return this.routes.get(task);
  }

  getFallbackChain(task: APTaskType): APProviderName[] {
    return this.routes.get(task)?.fallback ?? [];
  }
}

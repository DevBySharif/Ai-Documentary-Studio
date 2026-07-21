import type { APModel, APProviderName, APCapability } from "./types.js";

export class APModelRegistry {
  private models: APModel[] = [];

  register(provider: APProviderName, modelName: string, contextWindow: number, capabilities: APCapability[], cost: number, speed: number): void {
    this.models.push({ provider, modelName, contextWindow, capabilities, cost, speed, available: true });
  }

  getModels(provider?: APProviderName): APModel[] {
    if (provider) return this.models.filter((m) => m.provider === provider);
    return [...this.models];
  }

  findByCapability(capability: APCapability): APModel[] {
    return this.models.filter((m) => m.capabilities.includes(capability) && m.available);
  }

  getCheapest(capability: APCapability): APModel | undefined {
    return this.findByCapability(capability).sort((a, b) => a.cost - b.cost)[0];
  }

  getFastest(capability: APCapability): APModel | undefined {
    return this.findByCapability(capability).sort((a, b) => b.speed - a.speed)[0];
  }
}

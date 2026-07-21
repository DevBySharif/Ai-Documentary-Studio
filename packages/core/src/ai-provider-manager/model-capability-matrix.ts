import type { APCapability, APModel } from "./types.js";

export class APModelCapabilityMatrix {
  private matrix: Map<string, APCapability[]> = new Map();

  register(model: string, capabilities: APCapability[]): void {
    this.matrix.set(model, capabilities);
  }

  hasCapability(model: string, capability: APCapability): boolean {
    return this.matrix.get(model)?.includes(capability) ?? false;
  }

  findCompatible(capabilities: APCapability[], models: APModel[]): APModel[] {
    return models.filter((m) => capabilities.every((c) => this.hasCapability(m.modelName, c)));
  }
}

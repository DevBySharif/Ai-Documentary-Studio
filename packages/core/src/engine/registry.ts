import type { BaseEngine } from "./base.js";

export class EngineRegistry {
  private engines = new Map<string, BaseEngine>();

  register(engine: BaseEngine): void {
    if (this.engines.has(engine.name)) {
      throw new Error(`Engine "${engine.name}" is already registered`);
    }
    this.engines.set(engine.name, engine);
  }

  unregister(name: string): void {
    this.engines.delete(name);
  }

  get(name: string): BaseEngine | undefined {
    return this.engines.get(name);
  }

  getAll(): BaseEngine[] {
    return Array.from(this.engines.values());
  }

  has(name: string): boolean {
    return this.engines.has(name);
  }
}

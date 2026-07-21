import type { DAServiceRegistration } from "./types.js";

export class DAServiceRegistry {
  private services: Map<string, DAServiceRegistration> = new Map();
  private instances: Map<string, unknown> = new Map();

  register(name: string, version: string, dependencies: string[], lazy: boolean): void {
    this.services.set(name, { name, version, dependencies, lazy });
  }

  get(name: string): DAServiceRegistration | undefined {
    return this.services.get(name);
  }

  resolve(name: string): unknown | undefined {
    return this.instances.get(name);
  }

  instantiate(name: string, instance: unknown): void {
    this.instances.set(name, instance);
  }

  getDependencies(name: string): string[] {
    return this.services.get(name)?.dependencies ?? [];
  }

  getServices(): DAServiceRegistration[] {
    return Array.from(this.services.values());
  }

  clear(): void {
    this.services.clear();
    this.instances.clear();
  }
}

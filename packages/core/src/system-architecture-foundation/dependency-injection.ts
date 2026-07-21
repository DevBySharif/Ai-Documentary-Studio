export class DependencyInjectionContainer {
  private services: Map<string, any> = new Map();

  register<T>(token: string, implementation: T): void {
    if (this.services.has(token)) {
      console.warn(`[DI] Overwriting existing implementation for token: ${token}`);
    }
    this.services.set(token, implementation);
  }

  resolve<T>(token: string): T {
    const implementation = this.services.get(token);
    if (!implementation) {
      throw new Error(`[DI] No implementation registered for token: ${token}`);
    }
    return implementation as T;
  }
}

import { ServiceProvider, ServiceDefinition, Token } from "./types";

export class ServiceRegistry {
  private readonly definitions = new Map<Token, ServiceDefinition>();

  public register<T>(provider: ServiceProvider<T>): void {
    if (this.definitions.has(provider.token)) {
      // Allow override if explicitly configured, but by default warn or ignore.
      // For this system, we overwrite for testing/mocking, but log in a real impl.
    }

    this.definitions.set(provider.token, {
      provider,
      status: "Registered",
    });
  }

  public get<T>(token: Token<T>): ServiceDefinition<T> | undefined {
    return this.definitions.get(token) as ServiceDefinition<T> | undefined;
  }

  public has(token: Token): boolean {
    return this.definitions.has(token);
  }

  public getAll(): ServiceDefinition[] {
    return Array.from(this.definitions.values());
  }
}

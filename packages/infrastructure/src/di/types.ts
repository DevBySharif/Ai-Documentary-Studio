/**
 * Dependency Injection Core Types
 */

export const enum ServiceLifetime {
  Singleton = "Singleton",
  Scoped = "Scoped",
  Transient = "Transient"
}

export type Token<T = unknown> = string | symbol;

export interface BaseProvider {
  token: Token;
  lifetime: ServiceLifetime;
  module?: string;
  dependencies?: Token[];
}

export interface ClassProvider<T = unknown> extends BaseProvider {
  useClass: { new (...args: any[]): T };
}

export interface FactoryProvider<T = unknown> extends BaseProvider {
  useFactory: (container: ServiceResolver) => T;
}

export interface ValueProvider<T = unknown> extends BaseProvider {
  useValue: T;
  // Values are inherently Singleton, but we keep the structure consistent
  lifetime: ServiceLifetime.Singleton;
}

export type ServiceProvider<T = unknown> =
  | ClassProvider<T>
  | FactoryProvider<T>
  | ValueProvider<T>;

export interface Scope {
  id: string;
  name: string;
  dispose(): void;
}

export interface ServiceResolver {
  resolve<T>(token: Token<T>): T;
  resolveOptional<T>(token: Token<T>): T | undefined;
}

export interface ContainerContract extends ServiceResolver {
  createScope(name: string): Scope;
  loadModule(module: ContainerModuleContract): void;
  register<T>(provider: ServiceProvider<T>): void;
}

export interface ContainerModuleContract {
  name: string;
  register(container: ContainerContract): void;
}

export interface ServiceDefinition<T = unknown> {
  provider: ServiceProvider<T>;
  status: "Registered" | "Resolved";
  instance?: T; // Cached instance for Singleton/Scoped
}

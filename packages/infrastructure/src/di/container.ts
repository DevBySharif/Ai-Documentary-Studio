import {
  ContainerContract,
  ContainerModuleContract,
  Scope,
  ServiceLifetime,
  ServiceProvider,
  Token,
} from "./types";
import { ServiceRegistry } from "./registry";
import { DependencyValidator } from "./validator";
import { MissingRegistrationError } from "./exceptions";

class ScopeImpl implements Scope {
  private instances = new Map<Token, unknown>();

  constructor(public readonly id: string, public readonly name: string) {}

  public get<T>(token: Token<T>): T | undefined {
    return this.instances.get(token) as T | undefined;
  }

  public set<T>(token: Token<T>, instance: T): void {
    this.instances.set(token, instance);
  }

  public dispose(): void {
    this.instances.clear();
  }
}

export class ServiceContainer implements ContainerContract {
  private readonly registry = new ServiceRegistry();
  private readonly validator = new DependencyValidator(this.registry);
  private currentScope?: ScopeImpl;

  public register<T>(provider: ServiceProvider<T>): void {
    this.registry.register(provider);
  }

  public loadModule(module: ContainerModuleContract): void {
    module.register(this);
  }

  public validateAll(): void {
    this.validator.validateAll();
  }

  public resolve<T>(token: Token<T>): T {
    const instance = this.resolveInternal(token, []);
    if (!instance) {
      throw new MissingRegistrationError(token);
    }
    return instance as T;
  }

  public resolveOptional<T>(token: Token<T>): T | undefined {
    try {
      return this.resolveInternal(token, []);
    } catch (e) {
      if (e instanceof MissingRegistrationError) {
        return undefined;
      }
      throw e;
    }
  }

  public createScope(name: string): Scope {
    const scopeId = Math.random().toString(36).substring(2, 9);
    this.currentScope = new ScopeImpl(scopeId, name);
    return this.currentScope;
  }

  private resolveInternal<T>(token: Token<T>, path: Token[]): T {
    this.validator.validateGraph(token, path);

    const definition = this.registry.get(token);
    if (!definition) {
      throw new MissingRegistrationError(token);
    }

    const { provider } = definition;

    if (provider.lifetime === ServiceLifetime.Singleton && definition.instance) {
      return definition.instance as T;
    }

    if (provider.lifetime === ServiceLifetime.Scoped && this.currentScope) {
      const scopedInstance = this.currentScope.get<T>(token);
      if (scopedInstance) return scopedInstance;
    }

    const instance = this.instantiate(provider);

    if (provider.lifetime === ServiceLifetime.Singleton) {
      definition.instance = instance;
      definition.status = "Resolved";
    } else if (provider.lifetime === ServiceLifetime.Scoped && this.currentScope) {
      this.currentScope.set(token, instance);
      definition.status = "Resolved";
    }

    return instance as T;
  }

  private instantiate<T>(provider: ServiceProvider<T>): T {
    if ("useValue" in provider) {
      return provider.useValue;
    }

    if ("useFactory" in provider) {
      return provider.useFactory(this);
    }

    if ("useClass" in provider) {
      const ClassConstructor = provider.useClass;
      const dependencies = provider.dependencies || [];
      const resolvedDeps = dependencies.map((dep) => this.resolve(dep));
      return new ClassConstructor(...resolvedDeps);
    }

    throw new Error("Invalid provider configuration");
  }
}

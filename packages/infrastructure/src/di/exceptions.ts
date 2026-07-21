import { Token } from "./types";

export class DependencyInjectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DependencyInjectionError";
  }
}

export class MissingRegistrationError extends DependencyInjectionError {
  constructor(token: Token) {
    super(`No provider registered for token: ${String(token)}`);
    this.name = "MissingRegistrationError";
  }
}

export class CircularDependencyError extends DependencyInjectionError {
  constructor(path: Token[]) {
    const pathStr = path.map((t) => String(t)).join(" -> ");
    super(`Circular dependency detected: ${pathStr}`);
    this.name = "CircularDependencyError";
  }
}

export class LifetimeMismatchError extends DependencyInjectionError {
  constructor(dependent: Token, dependency: Token, reason: string) {
    super(`Lifetime mismatch: ${String(dependent)} cannot depend on ${String(dependency)}. ${reason}`);
    this.name = "LifetimeMismatchError";
  }
}

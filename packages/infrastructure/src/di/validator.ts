import { CircularDependencyError } from "./exceptions";
import { ServiceRegistry } from "./registry";
import { Token } from "./types";

export class DependencyValidator {
  constructor(private readonly registry: ServiceRegistry) {}

  public validateGraph(token: Token, path: Token[] = []): void {
    if (path.includes(token)) {
      throw new CircularDependencyError([...path, token]);
    }

    const definition = this.registry.get(token);
    if (!definition) {
      return; // Handled by MissingRegistrationError during resolution
    }

    const deps = definition.provider.dependencies;
    if (deps && deps.length > 0) {
      const newPath = [...path, token];
      for (const dep of deps) {
        this.validateGraph(dep, newPath);
      }
    }
  }

  public validateAll(): void {
    const all = this.registry.getAll();
    for (const def of all) {
      this.validateGraph(def.provider.token);
    }
  }
}

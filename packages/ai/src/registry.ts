import { IAIProvider } from './interfaces';
import { AICapability } from './models';

export class AdapterRegistry {
  private providers: Map<string, IAIProvider> = new Map();

  register(provider: IAIProvider): void {
    if (this.providers.has(provider.name)) {
      throw new Error(`Provider ${provider.name} is already registered.`);
    }
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): IAIProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): IAIProvider[] {
    return Array.from(this.providers.values());
  }

  getProvidersByCapability(capabilities: AICapability[]): IAIProvider[] {
    return this.getAllProviders().filter(provider => {
      return capabilities.every(cap => provider.capabilities.has(cap));
    });
  }
}

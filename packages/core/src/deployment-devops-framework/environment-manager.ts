import { Environment } from './types';

export class EnvironmentManager {
  private currentEnv: Environment = "Local";

  setEnvironment(env: Environment): void {
    this.currentEnv = env;
  }

  getEnvironment(): Environment {
    return this.currentEnv;
  }

  loadSecretsForEnvironment(): void {
    console.log(`Loading isolated secrets for ${this.currentEnv} environment`);
  }
}

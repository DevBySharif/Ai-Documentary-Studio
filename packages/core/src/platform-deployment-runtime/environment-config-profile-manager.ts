import { ConfigProfileType, DeploymentModeType, RuntimeEnvironmentType } from "./deployment-types";

export interface ExternalEnvironmentConfig {
  readonly profile: ConfigProfileType;
  readonly deploymentMode: DeploymentModeType;
  readonly runtimeEnv: RuntimeEnvironmentType;
  readonly databaseConnectionString: string;
  readonly storageBucketEndpoint: string;
  readonly aiGatewayEndpoint: string;
}

/**
 * Environment Configuration Externalizer & Profile Manager (Vol 09 Part 01 - Section 7, Section 8).
 * Externalizes runtime configuration across 5 profiles (`Development`, `Testing`, `Staging`, `Production`, `EnterpriseProduction`).
 */
export class EnvironmentConfigProfileManager {
  public loadConfigProfile(
    profile: ConfigProfileType = "Production",
    mode: DeploymentModeType = "Desktop",
    runtime: RuntimeEnvironmentType = "NativeDesktop"
  ): ExternalEnvironmentConfig {
    return {
      profile,
      deploymentMode: mode,
      runtimeEnv: runtime,
      databaseConnectionString: profile === "Development" ? "sqlite://local.db" : "postgres://db.production.local:5432/aistudio",
      storageBucketEndpoint: mode === "Desktop" ? "file://C:/Users/AppData/Local/Studio" : "s3://prod-studio-storage",
      aiGatewayEndpoint: mode === "EnterpriseOnPremises" ? "https://ai-gateway.internal.net" : "https://api.aidocumentary.studio/v1",
    };
  }
}

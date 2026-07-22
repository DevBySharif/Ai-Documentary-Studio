import { EnvironmentConfigProfileManager } from "./environment-config-profile-manager";
import { ServiceDiscoveryBootstrapOrchestrator } from "./service-discovery-bootstrap-orchestrator";
import { DeploymentValidatorHealthChecker } from "./deployment-validator-health-checker";
import { FeatureFlagMultiTenantIsolator } from "./feature-flag-multi-tenant-isolator";
import { DeploymentModeType, RuntimeEnvironmentType, ConfigProfileType } from "./deployment-types";

/**
 * Master Platform Deployment Runtime Engine (Main Vol 09 Part 01).
 * Core entry point for 5-layer deployment architecture (`Core Platform → Deployment Layer → Runtime Environment → Infrastructure → Operating System`).
 */
export class MasterPlatformDeploymentRuntime {
  public readonly configManager = new EnvironmentConfigProfileManager();
  public readonly bootstrapOrchestrator = new ServiceDiscoveryBootstrapOrchestrator();
  public readonly validator = new DeploymentValidatorHealthChecker();
  public readonly featureTenantIsolator = new FeatureFlagMultiTenantIsolator();

  public bootstrapDeploymentPlatform(
    mode: DeploymentModeType = "Desktop",
    runtime: RuntimeEnvironmentType = "NativeDesktop",
    profile: ConfigProfileType = "Production"
  ): {
    config: ReturnType<EnvironmentConfigProfileManager["loadConfigProfile"]>;
    validation: ReturnType<DeploymentValidatorHealthChecker["validateDeployment"]>;
    bootstrapResults: ReturnType<ServiceDiscoveryBootstrapOrchestrator["executeBootstrapSequence"]>;
  } {
    const config = this.configManager.loadConfigProfile(profile, mode, runtime);
    const validation = this.validator.validateDeployment();

    if (!validation.isPassed) {
      throw new Error("Deployment validation failed! Startup aborted.");
    }

    const bootstrapResults = this.bootstrapOrchestrator.executeBootstrapSequence();

    return {
      config,
      validation,
      bootstrapResults,
    };
  }
}

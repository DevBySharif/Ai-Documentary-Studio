import { ApiEvolutionDeprecationManager } from "./api-evolution-deprecation-manager";
import { PluginCertificationEngine } from "./plugin-certification-engine";
import { SecurityAdvisoryLtsCoordinator } from "./security-advisory-lts-coordinator";
import { EcosystemHealthMarketplaceGovernor } from "./ecosystem-health-marketplace-governor";
import { PluginCertificationLevel } from "./ecosystem-governance-types";

/**
 * Master Ecosystem Governance & Certification Engine (Main Vol 10 Part 08).
 * Core entry point for 6-layer governance architecture (`Platform Core → SDK Governance → Developer Ecosystem → Marketplace → Organizations → End Users`).
 */
export class MasterEcosystemGovernanceCertification {
  public readonly apiEvolution = new ApiEvolutionDeprecationManager();
  public readonly certificationEngine = new PluginCertificationEngine();
  public readonly securityLts = new SecurityAdvisoryLtsCoordinator();
  public readonly healthGovernor = new EcosystemHealthMarketplaceGovernor();

  public certifyAndAuditPlugin(
    pluginId: string,
    level: PluginCertificationLevel = "Verified"
  ): ReturnType<PluginCertificationEngine["evaluatePluginCertification"]> {
    return this.certificationEngine.evaluatePluginCertification(pluginId, level);
  }
}

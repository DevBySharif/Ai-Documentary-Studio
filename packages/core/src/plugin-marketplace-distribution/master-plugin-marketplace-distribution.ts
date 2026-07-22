import { PublishingPipelineValidator } from "./publishing-pipeline-validator";
import { PackageSignerTrustFramework } from "./package-signer-trust-framework";
import { MarketplaceDiscoveryDelivery } from "./marketplace-discovery-delivery";
import { EnterprisePrivateRepository } from "./enterprise-private-repository";
import { MarketplacePackageType } from "./marketplace-types";

/**
 * Master Plugin Marketplace Distribution Engine (Main Vol 10 Part 05).
 * Core entry point for 5-layer marketplace architecture (`Developer → Publishing Service → Validation Pipeline → Marketplace Repository → Users & Organizations`).
 */
export class MasterPluginMarketplaceDistribution {
  public readonly publishingPipeline = new PublishingPipelineValidator();
  public readonly trustFramework = new PackageSignerTrustFramework();
  public readonly discoveryDelivery = new MarketplaceDiscoveryDelivery();
  public readonly enterpriseRepo = new EnterprisePrivateRepository();

  public publishAndSignPackage(
    packageId: string,
    packageType: MarketplacePackageType = "Plugins"
  ): {
    publishing: ReturnType<PublishingPipelineValidator["executePublishingPipeline"]>;
    signature: ReturnType<PackageSignerTrustFramework["verifyDigitalSignature"]>;
  } {
    const publishing = this.publishingPipeline.executePublishingPipeline(packageId, packageType);
    const signature = this.trustFramework.verifyDigitalSignature(packageId);

    return {
      publishing,
      signature,
    };
  }
}

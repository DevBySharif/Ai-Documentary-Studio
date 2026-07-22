import { PublicSdkFacade } from "./public-sdk-facade";
import { ApiClassificationContextGuard } from "./api-classification-context-guard";
import { CapabilityNegotiatorSemverEngine } from "./capability-negotiator-semver-engine";
import { EventCommandDispatcherVault } from "./event-command-dispatcher-vault";

/**
 * Master Developer Extension API Engine (Main Vol 10 Part 02).
 * Core entry point for 5-layer API architecture (`Core Platform → Public SDK → Extension API → Plugins → Custom Modules`).
 */
export class MasterDeveloperExtensionApi {
  public readonly sdk = new PublicSdkFacade();
  public readonly guardContext = new ApiClassificationContextGuard();
  public readonly capabilityNegotiator = new CapabilityNegotiatorSemverEngine();
  public readonly commandVault = new EventCommandDispatcherVault();

  public getPublicSdkForExtension(workspaceId: string, userId: string): {
    sdk: PublicSdkFacade;
    context: ReturnType<ApiClassificationContextGuard["createExecutionContext"]>;
  } {
    const context = this.guardContext.createExecutionContext(workspaceId, userId);
    return {
      sdk: this.sdk,
      context,
    };
  }
}

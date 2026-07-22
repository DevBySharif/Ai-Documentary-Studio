import { ConnectorRegistryHealthManager } from "./connector-registry-health-manager";
import { ConnectorSdkDataMapper } from "./connector-sdk-interface";
import { EventAutomationWorkflowEngine } from "./event-automation-workflow-engine";
import { RateLimitAuthSecurityVault } from "./rate-limit-auth-security-vault";
import { ConnectorCategoryType, ConnectorCapabilityType } from "./connector-types";

/**
 * Master Enterprise Connector Automation Engine (Main Vol 08 Part 08).
 * Core entry point for 5-layer integration architecture (`Core Platform → Integration Layer → Connector Manager → Connector SDK → External Services`).
 */
export class MasterEnterpriseConnectorAutomation {
  public readonly registryManager = new ConnectorRegistryHealthManager();
  public readonly dataMapper = new ConnectorSdkDataMapper();
  public readonly automationEngine = new EventAutomationWorkflowEngine();
  public readonly rateLimitVault = new RateLimitAuthSecurityVault();

  public triggerExternalAutomation(
    eventName: string,
    targetConnectorId: string,
    capability: ConnectorCapabilityType,
    payloadObj: unknown
  ): ReturnType<EventAutomationWorkflowEngine["executeAutomationWorkflow"]> {
    const trigger = this.automationEngine.registerAutomationTrigger(eventName, targetConnectorId, capability, payloadObj);
    return this.automationEngine.executeAutomationWorkflow(trigger.triggerId);
  }

  public getAvailableConnectors(category: ConnectorCategoryType): ReturnType<ConnectorRegistryHealthManager["getConnectorsByCategory"]> {
    return this.registryManager.getConnectorsByCategory(category);
  }
}

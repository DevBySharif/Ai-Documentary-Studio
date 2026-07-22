import { ConnectorDescriptor, ConnectorCategoryType, ConnectorCapabilityType } from "./connector-types";

/**
 * Connector Registry & Health Monitor (Vol 08 Part 08 - Section 4, Section 7, Section 11, Section 13).
 * Manages marketplace connectors, dynamic capability discovery, and health telemetry.
 */
export class ConnectorRegistryHealthManager {
  private registeredConnectors = new Map<string, ConnectorDescriptor>();

  constructor() {
    this.initDefaultConnectors();
  }

  private initDefaultConnectors(): void {
    const yt: ConnectorDescriptor = {
      connectorId: "conn_youtube",
      name: "YouTube Studio",
      category: "MediaPlatforms",
      version: "1.0.0",
      provider: "Google",
      capabilities: ["PublishVideo", "SendNotification"],
      authMethod: "OAuth2",
      health: { isHealthy: true, apiLatencyMs: 140, errorRatePercent: 0, remainingQuota: 10000, lastCheckedAt: new Date() },
      isEnabled: true,
    };

    const slack: ConnectorDescriptor = {
      connectorId: "conn_slack",
      name: "Slack Webhooks",
      category: "Productivity",
      version: "2.1.0",
      provider: "Slack Technologies",
      capabilities: ["SendNotification"],
      authMethod: "OAuth2",
      health: { isHealthy: true, apiLatencyMs: 85, errorRatePercent: 0, remainingQuota: 50000, lastCheckedAt: new Date() },
      isEnabled: true,
    };

    this.registeredConnectors.set(yt.connectorId, yt);
    this.registeredConnectors.set(slack.connectorId, slack);
  }

  public getConnectorsByCategory(category: ConnectorCategoryType): ReadonlyArray<ConnectorDescriptor> {
    return Array.from(this.registeredConnectors.values()).filter((c) => c.category === category);
  }

  public discoverCapabilitiesForConnector(connectorId: string): ReadonlyArray<ConnectorCapabilityType> {
    const conn = this.registeredConnectors.get(connectorId);
    return conn ? conn.capabilities : [];
  }
}

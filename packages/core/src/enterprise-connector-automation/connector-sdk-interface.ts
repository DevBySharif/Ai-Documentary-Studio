import { ConnectorCapabilityType, ConnectorDescriptor } from "./connector-types";

export interface StandardConnectorSdk {
  readonly connectorInfo: ConnectorDescriptor;
  executeCapability(capability: ConnectorCapabilityType, inputPayload: Record<string, unknown>): Promise<{ success: boolean; resultData: Record<string, unknown> }>;
  healthCheck(): Promise<ConnectorDescriptor["health"]>;
}

/**
 * Connector SDK & Data Mapping Engine (Vol 08 Part 08 - Section 6, Section 10).
 * Provides standardized SDK contracts and schema data mapping to isolate third-party dependencies from core logic.
 */
export class ConnectorSdkDataMapper {
  public mapExternalDataToCoreSchema(externalData: Record<string, unknown>): Record<string, unknown> {
    return {
      coreAssetId: externalData["id"] || externalData["file_id"],
      title: externalData["title"] || externalData["name"] || "Untitled External Asset",
      mappedAt: new Date(),
    };
  }
}

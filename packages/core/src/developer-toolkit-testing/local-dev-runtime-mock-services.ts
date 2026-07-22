import { MockServiceType } from "./developer-toolkit-types";

export interface LocalDevEnvironmentStatus {
  readonly isLocalRuntimeActive: boolean;
  readonly activeMockServices: ReadonlyArray<MockServiceType>;
  readonly devWorkspaceId: string;
}

/**
 * Local Development Runtime & 6 Mock Platform Services (Vol 10 Part 07 - Section 4, Section 8).
 * Manages local dev environments and simulates 6 platform services (Auth, Workspace, AI providers, Event bus, Storage, Notifications).
 */
export class LocalDevRuntimeMockServices {
  private activeMocks: Set<MockServiceType> = new Set<MockServiceType>([
    "Authentication",
    "Workspace",
    "AiProviders",
    "EventBus",
    "Storage",
    "Notifications",
  ]);

  public startLocalDevRuntime(): LocalDevEnvironmentStatus {
    return {
      isLocalRuntimeActive: true,
      activeMockServices: Array.from(this.activeMocks),
      devWorkspaceId: `ws_dev_${Math.random().toString(36).substring(2, 7)}`,
    };
  }

  public simulateMockServiceResponse(service: MockServiceType, requestPayload: unknown): Record<string, unknown> {
    return {
      service,
      isSimulated: true,
      timestamp: new Date(),
      data: requestPayload,
    };
  }
}

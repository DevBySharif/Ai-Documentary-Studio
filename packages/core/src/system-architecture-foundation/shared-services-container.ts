import { SharedServiceType } from "./architecture-types";

export interface SharedServiceDescriptor {
  readonly serviceType: SharedServiceType;
  readonly isStateless: boolean;
  readonly isRegistered: boolean;
}

/**
 * Shared Services Container (Vol 06 Part 01 - Section 14).
 * Manages shared stateless utility services (Logging, Notification, Settings, Storage, Queue, Auth, Update).
 */
export class SharedServicesContainer {
  private services = new Map<SharedServiceType, SharedServiceDescriptor>();

  constructor() {
    this.initServices();
  }

  private initServices(): void {
    const list: SharedServiceType[] = [
      "LoggingService",
      "NotificationService",
      "SettingsService",
      "StorageService",
      "QueueService",
      "AuthenticationService",
      "UpdateService",
    ];

    list.forEach((st) => {
      this.services.set(st, { serviceType: st, isStateless: true, isRegistered: true });
    });
  }

  public getService(type: SharedServiceType): SharedServiceDescriptor | undefined {
    return this.services.get(type);
  }
}

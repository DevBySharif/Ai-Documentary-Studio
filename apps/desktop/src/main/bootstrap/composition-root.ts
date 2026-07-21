import { ServiceContainer } from "../../../../../packages/infrastructure/src/di/index";
import { LifecycleManager } from "../lifecycle/lifecycle-manager";
import { IpcRouter } from "../ipc/ipc-router";
import { WindowManager } from "../windows/window-manager";
import { SecurityInitializer } from "../security/security-initializer";

export class CompositionRoot {
  public readonly container = new ServiceContainer();

  public build(): void {
    // Register foundational singletons
    this.container.register({
      token: "LifecycleManager",
      useValue: new LifecycleManager(),
      lifetime: "Singleton" as any
    });

    this.container.register({
      token: "IpcRouter",
      useValue: new IpcRouter(),
      lifetime: "Singleton" as any
    });

    this.container.register({
      token: "WindowManager",
      useValue: new WindowManager(),
      lifetime: "Singleton" as any
    });

    this.container.register({
      token: "SecurityInitializer",
      useValue: new SecurityInitializer(),
      lifetime: "Singleton" as any
    });

    // We can also load modules from domain/application/infrastructure here
    this.container.validateAll();
  }
}

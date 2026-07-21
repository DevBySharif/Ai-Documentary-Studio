import { CompositionRoot } from "./composition-root";
import { StartupProfiler } from "../diagnostics/startup-profiler";
import { LifecycleManager, LifecycleEvent } from "../lifecycle/lifecycle-manager";
import { SecurityInitializer } from "../security/security-initializer";
import { IpcRouter } from "../ipc/ipc-router";
import { WindowManager } from "../windows/window-manager";

export class BootstrapManager {
  private profiler = new StartupProfiler();
  private root = new CompositionRoot();

  public async bootstrap(): Promise<void> {
    this.profiler.startStage("Bootstrap");

    // 1. Load Configuration (mocked for now)
    this.profiler.startStage("LoadConfig");
    // const config = await loadConfig();
    this.profiler.endStage("LoadConfig");

    // 2. Initialize Security
    this.profiler.startStage("InitializeSecurity");
    const security = new SecurityInitializer();
    security.initialize();
    this.profiler.endStage("InitializeSecurity");

    // 3. Build DI Container
    this.profiler.startStage("BuildContainer");
    this.root.build();
    this.profiler.endStage("BuildContainer");

    const lifecycle = this.root.container.resolve<LifecycleManager>("LifecycleManager");
    lifecycle.emit(LifecycleEvent.BootstrapStarted);

    // 4. Initialize Services
    this.profiler.startStage("InitializeServices");
    // this.root.container.resolve("DatabaseService");
    // this.root.container.resolve("EventBus");
    lifecycle.emit(LifecycleEvent.ServicesInitialized);
    this.profiler.endStage("InitializeServices");

    // 5. Load Plugins
    this.profiler.startStage("LoadPlugins");
    // await pluginManager.loadAll();
    this.profiler.endStage("LoadPlugins");

    // 6. Register IPC
    this.profiler.startStage("RegisterIPC");
    const ipcRouter = this.root.container.resolve<IpcRouter>("IpcRouter");
    ipcRouter.registerAll();
    this.profiler.endStage("RegisterIPC");

    // 7. Create Windows
    this.profiler.startStage("CreateWindows");
    const windowManager = this.root.container.resolve<WindowManager>("WindowManager");
    windowManager.createMainWindow();
    lifecycle.emit(LifecycleEvent.WindowsCreated);
    this.profiler.endStage("CreateWindows");

    // Application Ready
    lifecycle.emit(LifecycleEvent.ApplicationReady);
    this.profiler.endStage("Bootstrap");

    this.profiler.logReport();
  }
}

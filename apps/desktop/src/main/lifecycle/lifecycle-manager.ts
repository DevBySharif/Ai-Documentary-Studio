import { EventEmitter } from "events";

export const enum LifecycleEvent {
  BootstrapStarted = "BootstrapStarted",
  ServicesInitialized = "ServicesInitialized",
  WindowsCreated = "WindowsCreated",
  ApplicationReady = "ApplicationReady",
  ShutdownRequested = "ShutdownRequested",
  ApplicationTerminated = "ApplicationTerminated"
}

export class LifecycleManager {
  private readonly emitter = new EventEmitter();

  public emit(event: LifecycleEvent, payload?: unknown): void {
    this.emitter.emit(event, payload);
  }

  public on(event: LifecycleEvent, listener: (payload?: unknown) => void): void {
    this.emitter.on(event, listener);
  }

  public async requestShutdown(): Promise<void> {
    this.emit(LifecycleEvent.ShutdownRequested);
    
    // In a real implementation, we would await graceful shutdown of services,
    // databases, and plugin runtimes here before exiting.
    
    this.emit(LifecycleEvent.ApplicationTerminated);
  }
}

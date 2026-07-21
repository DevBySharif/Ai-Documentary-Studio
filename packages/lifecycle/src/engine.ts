import { BootstrapManager } from './bootstrap';
import { LifecycleManager } from './lifecycle';
import { WorkflowOrchestrator } from './orchestrator';
import { RecoveryManager } from './recovery';
import { ShutdownManager } from './shutdown';

export class LifecycleEngineFacade {
  public bootstrap: BootstrapManager;
  public lifecycle: LifecycleManager;
  public orchestrator: WorkflowOrchestrator;
  public recovery: RecoveryManager;
  public shutdown: ShutdownManager;

  constructor() {
    this.bootstrap = new BootstrapManager();
    this.lifecycle = new LifecycleManager();
    this.orchestrator = new WorkflowOrchestrator();
    this.recovery = new RecoveryManager();
    
    // Wire dependencies
    this.shutdown = new ShutdownManager(
      this.lifecycle, 
      this.orchestrator, 
      this.recovery
    );
  }

  async startApplication(): Promise<void> {
    await this.recovery.checkRecoveryState();
    await this.bootstrap.boot();
    this.lifecycle.transition('Ready');
    this.lifecycle.broadcast('ApplicationStarted');
  }

  async stopApplication(): Promise<void> {
    await this.shutdown.executeGracefulShutdown();
  }
}

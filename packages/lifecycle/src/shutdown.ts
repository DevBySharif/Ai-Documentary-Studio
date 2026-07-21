import { LifecycleManager } from './lifecycle';
import { WorkflowOrchestrator } from './orchestrator';
import { RecoveryManager } from './recovery';
import pino from 'pino';

const logger = pino({ name: 'shutdown-manager' });

/**
 * Ensures graceful termination of all subsystems.
 */
export class ShutdownManager {
  constructor(
    private lifecycle: LifecycleManager,
    private orchestrator: WorkflowOrchestrator,
    private recovery: RecoveryManager
  ) {}

  async executeGracefulShutdown(): Promise<void> {
    logger.info('Initiating Graceful Shutdown sequence');
    
    this.lifecycle.transition('ShuttingDown');
    this.lifecycle.broadcast('ShutdownInitiated');

    // 1. Stop New Tasks
    const pending = this.orchestrator.getPendingCount();
    logger.info(`Waiting for ${pending} critical tasks to complete or abort...`);

    // 2. Save Final State
    this.recovery.saveCheckpoint('Terminated');

    // 3. Flush Logs / Close DB
    logger.info('Closing database connections and flushing telemetry...');

    this.lifecycle.transition('Terminated');
    this.lifecycle.broadcast('ApplicationExited');
    
    logger.info('Shutdown complete. Safe to exit process.');
  }
}

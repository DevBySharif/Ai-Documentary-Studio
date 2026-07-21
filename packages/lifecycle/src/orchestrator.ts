import pino from 'pino';
import { randomUUID } from 'crypto';

const logger = pino({ name: 'workflow-orchestrator' });

export type JobPriority = 'Low' | 'Normal' | 'High' | 'Critical';

export interface WorkflowJob {
  id: string;
  name: string;
  priority: JobPriority;
  execute: () => Promise<void>;
  cancel: () => void;
}

/**
 * Global Task Scheduler managing background workflows.
 */
export class WorkflowOrchestrator {
  private queue: WorkflowJob[] = [];
  private activeJobs = new Set<string>();
  private readonly maxConcurrency = 2; // Configurable based on system specs

  submit(name: string, priority: JobPriority, execute: () => Promise<void>, cancel: () => void): string {
    const id = randomUUID();
    logger.info({ jobId: id, name, priority }, 'Job submitted to Orchestrator');

    this.queue.push({ id, name, priority, execute, cancel });
    this.sortQueue();
    this.tick();
    return id;
  }

  cancel(jobId: string): void {
    const jobIndex = this.queue.findIndex(j => j.id === jobId);
    if (jobIndex > -1) {
      logger.info({ jobId }, 'Cancelling queued job');
      const [job] = this.queue.splice(jobIndex, 1);
      job.cancel();
    } else if (this.activeJobs.has(jobId)) {
      logger.warn({ jobId }, 'Cannot cancel currently executing job in this mock');
    }
  }

  getPendingCount(): number {
    return this.queue.length + this.activeJobs.size;
  }

  private sortQueue() {
    const weights: Record<JobPriority, number> = { Low: 0, Normal: 1, High: 2, Critical: 3 };
    this.queue.sort((a, b) => weights[b.priority] - weights[a.priority]);
  }

  private async tick() {
    if (this.activeJobs.size >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift()!;
    this.activeJobs.add(job.id);
    
    try {
      logger.debug({ jobId: job.id, name: job.name }, 'Executing job');
      await job.execute();
      logger.debug({ jobId: job.id }, 'Job completed successfully');
    } catch (error) {
      logger.error({ jobId: job.id, error }, 'Job failed');
    } finally {
      this.activeJobs.delete(job.id);
      this.tick();
    }
  }
}

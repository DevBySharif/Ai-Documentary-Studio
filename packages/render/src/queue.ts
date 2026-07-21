import { RenderJob } from './models';
import pino from 'pino';

const logger = pino({ name: 'render-queue' });

export class RenderQueueManager {
  private queue: RenderJob[] = [];
  private activeJob: RenderJob | null = null;

  enqueue(job: RenderJob, priority: 'Immediate' | 'High' | 'Normal' | 'Background' = 'Normal'): void {
    logger.info({ jobId: job.id, priority }, 'Job enqueued');
    
    // In a real system, we'd insert based on priority. Here we just push.
    if (priority === 'Immediate') {
      this.queue.unshift(job);
    } else {
      this.queue.push(job);
    }
  }

  dequeue(): RenderJob | undefined {
    return this.queue.shift();
  }

  getActiveJob(): RenderJob | null {
    return this.activeJob;
  }

  setActiveJob(job: RenderJob | null) {
    this.activeJob = job;
  }

  cancelJob(jobId: string): boolean {
    if (this.activeJob?.id === jobId) {
      logger.info({ jobId }, 'Cancelling active job');
      this.activeJob.status = 'Cancelled';
      return true;
    }

    const index = this.queue.findIndex(j => j.id === jobId);
    if (index !== -1) {
      this.queue[index].status = 'Cancelled';
      this.queue.splice(index, 1);
      logger.info({ jobId }, 'Cancelled queued job');
      return true;
    }

    return false;
  }
}

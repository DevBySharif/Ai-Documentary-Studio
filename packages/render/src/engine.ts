import { Timeline } from '@studio/timeline';
import { RenderJob, RenderPreset, RenderSegment } from './models';
import { IRenderBackend } from './backend';
import { RenderPlanner } from './planner';
import { RenderValidator } from './validator';
import { RenderQueueManager } from './queue';
import { RecoveryManager } from './recovery';
import pino from 'pino';

const logger = pino({ name: 'render-engine' });

export class RenderEngine {
  private queueManager = new RenderQueueManager();

  constructor(private backend: IRenderBackend) {}

  /**
   * Submits a timeline for rendering. Validates, plans segments, and enqueues the job.
   */
  submitJob(timeline: Timeline, preset: RenderPreset, destPath: string): string {
    logger.info({ timelineId: timeline.id }, 'Submitting render job');
    
    // 1. Validate
    RenderValidator.validate(timeline, preset, destPath);

    // 2. Plan Segments
    const { job, segments } = RenderPlanner.createPlan(timeline, preset, destPath);

    // 3. Queue (we attach segments to the job object dynamically for execution context)
    (job as any).segments = segments;
    (job as any).timeline = timeline;

    this.queueManager.enqueue(job);
    
    // Start processing if idle (async)
    if (!this.queueManager.getActiveJob()) {
      this.processNextJob().catch(err => logger.error(err, 'Render loop error'));
    }

    return job.id;
  }

  /**
   * Processes the next job in the queue asynchronously.
   */
  private async processNextJob(): Promise<void> {
    const job = this.queueManager.dequeue();
    if (!job) return;

    this.queueManager.setActiveJob(job);
    job.status = 'Initializing';

    try {
      const timeline: Timeline = (job as any).timeline;
      let segments: RenderSegment[] = (job as any).segments;

      // Check for recovery
      segments = RecoveryManager.determineCheckpoint(job, segments);

      // Initialize backend
      await this.backend.initialize(job.preset, job.outputFile);
      job.status = 'Rendering';
      job.startedAt = new Date();

      // We process sequentially in this mock, but segments could be parallelized here
      for (const segment of segments) {
        if ((job.status as string) === 'Cancelled') break;
        if (segment.status === 'Completed') continue; // Skip recovered segments

        segment.status = 'Rendering';
        
        // Frame by frame evaluation
        for (let frame = segment.startFrame; frame < segment.endFrame; frame++) {
          if ((job.status as string) === 'Cancelled' || (job.status as string) === 'Paused') break;

          // Push the timeline state through the backend
          await this.backend.renderFrame(timeline, frame);
          
          job.framesRendered++;
          job.progress = (job.framesRendered / job.totalFrames) * 100;
        }

        if (job.status === 'Rendering') {
          segment.status = 'Completed';
        }
      }

      if ((job.status as string) !== 'Cancelled') {
        await this.backend.finalize();
        job.status = 'Completed';
        job.completedAt = new Date();
        logger.info({ jobId: job.id }, 'Render job completed successfully');
      }

    } catch (error) {
      job.status = 'Failed';
      job.error = error instanceof Error ? error.message : String(error);
      logger.error({ jobId: job.id, error }, 'Render job failed');
      await this.backend.cancel();
    } finally {
      this.queueManager.setActiveJob(null);
      // Process next in queue
      this.processNextJob().catch(err => logger.error(err, 'Render loop error'));
    }
  }

  cancelJob(jobId: string): boolean {
    const cancelled = this.queueManager.cancelJob(jobId);
    if (cancelled && this.queueManager.getActiveJob()?.id === jobId) {
      this.backend.cancel().catch(e => logger.error(e, 'Failed to cancel backend'));
    }
    return cancelled;
  }
}

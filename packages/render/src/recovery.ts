import { RenderJob, RenderSegment } from './models';
import pino from 'pino';

const logger = pino({ name: 'render-recovery' });

export class RecoveryManager {
  /**
   * Analyzes segments for a job to determine the last valid checkpoint.
   * Modifies the segments array to mark completed ones, and updates the job progress.
   */
  static determineCheckpoint(job: RenderJob, segments: RenderSegment[]): RenderSegment[] {
    let framesRendered = 0;
    
    for (const segment of segments) {
      // In a real implementation, we would check the filesystem to see if segment.outputFile exists and is valid.
      // We simulate checking the status field.
      if (segment.status === 'Completed') {
        const segmentFrames = segment.endFrame - segment.startFrame;
        framesRendered += segmentFrames;
      } else {
        segment.status = 'Pending'; // Ensure non-completed segments are reset
      }
    }

    job.framesRendered = framesRendered;
    job.progress = (job.framesRendered / job.totalFrames) * 100;

    logger.info({ jobId: job.id, recoveredFrames: framesRendered }, 'Recovery checkpoint determined');
    return segments;
  }
}

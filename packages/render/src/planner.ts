import { Timeline } from '@studio/timeline';
import { RenderJob, RenderSegment, RenderPreset } from './models';
import { randomUUID } from 'crypto';
import pino from 'pino';

const logger = pino({ name: 'render-planner' });

export class RenderPlanner {
  /**
   * Plans a render job, chunking the timeline into parallelizable segments.
   */
  static createPlan(timeline: Timeline, preset: RenderPreset, outputFile: string): { job: RenderJob, segments: RenderSegment[] } {
    logger.info({ timelineId: timeline.id }, 'Planning render job');

    const job: RenderJob = {
      id: randomUUID(),
      timelineId: timeline.id,
      timelineVersion: timeline.version,
      preset,
      status: 'Pending',
      progress: 0,
      framesRendered: 0,
      totalFrames: timeline.durationFrames,
      outputFile,
      createdAt: new Date(),
    };

    // Blueprint mandates Segment-Based Rendering
    // For a 60fps timeline, a 1-minute segment is 3600 frames
    const SEGMENT_SIZE = preset.fps * 60; 
    const segments: RenderSegment[] = [];

    for (let startFrame = 0; startFrame < timeline.durationFrames; startFrame += SEGMENT_SIZE) {
      const endFrame = Math.min(startFrame + SEGMENT_SIZE, timeline.durationFrames);
      segments.push({
        id: randomUUID(),
        jobId: job.id,
        startFrame,
        endFrame,
        outputFile: `${outputFile}.part${segments.length}`,
        status: 'Pending'
      });
    }

    logger.debug({ jobId: job.id, segmentCount: segments.length }, 'Render plan created');

    return { job, segments };
  }
}

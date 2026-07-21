import { Transform } from './models';
import { Clip, InterpolationType } from '@studio/timeline';
import { VirtualCamera } from './camera';
import { MotionConflictResolver } from './resolver';
import pino from 'pino';

const logger = pino({ name: 'motion-engine' });

export class MotionEngine {
  /**
   * Evaluates the full transform of a clip at a specific absolute timeline frame.
   * This is called by the Render Planner prior to rasterization.
   */
  static evaluateClipTransform(clip: Clip, currentTimelineFrame: number): Transform {
    // 1. Check bounds
    if (currentTimelineFrame < clip.startFrame || currentTimelineFrame >= clip.endFrame) {
      // Technically shouldn't be rendering, but return default if asked
      return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 };
    }

    // 2. Resolve conflicts
    MotionConflictResolver.resolve(clip);

    // Default transform
    const transform: Transform = { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 };

    // 3. Evaluate keyframes
    // In a full implementation, this groups keyframes by property and finds the bounding pair for the current frame.
    // We stub the structural logic here.
    const relativeFrame = currentTimelineFrame - clip.startFrame;
    
    // We use the VirtualCamera to handle property interpolations if needed, or inline it.
    // For blueprint purposes, we just return the identity transform assuming no keyframes.
    if (clip.keyframes.length === 0) {
      return transform;
    }

    logger.debug({ clipId: clip.id, relativeFrame }, 'Evaluated motion transform');
    return transform; // A real implementation would return the interpolated values
  }
}

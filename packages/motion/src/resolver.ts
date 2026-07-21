import { Clip } from '@studio/timeline';
import pino from 'pino';

const logger = pino({ name: 'motion-conflict-resolver' });

export class MotionConflictResolver {
  /**
   * Scans a clip's keyframes for impossible transforms or logical conflicts.
   * Modifies the keyframes in place to resolve conflicts, or throws if unresolvable.
   */
  static resolve(clip: Clip): void {
    if (!clip.keyframes || clip.keyframes.length === 0) return;

    // 1. Sort keyframes by timeFrame
    clip.keyframes.sort((a, b) => a.timeFrame - b.timeFrame);

    const propertyTimes = new Map<string, Set<number>>();

    for (let i = 0; i < clip.keyframes.length; i++) {
      const kf = clip.keyframes[i];

      // Detect duplicate keyframes at the exact same frame for the same property
      const times = propertyTimes.get(kf.property) || new Set<number>();
      if (times.has(kf.timeFrame)) {
        logger.warn({ clipId: clip.id, property: kf.property, timeFrame: kf.timeFrame }, 'Duplicate keyframe detected. Discarding older one.');
        // Remove the duplicate (we assume the latter one in the array is the overwrite)
        clip.keyframes.splice(i - 1, 1);
        i--; // Adjust index
        continue;
      }
      times.add(kf.timeFrame);
      propertyTimes.set(kf.property, times);

      // Rule: Scale cannot be negative or zero (in most 2D engines, though negative can mean flip, we restrict it here as per blueprint constraints)
      if (kf.property === 'scale' && typeof kf.value === 'number') {
        if (kf.value <= 0) {
          logger.warn({ clipId: clip.id, value: kf.value }, 'Invalid scale <= 0. Clamping to 0.01');
          kf.value = 0.01;
        }
      }

      // Rule: Opacity must be 0-1
      if (kf.property === 'opacity' && typeof kf.value === 'number') {
        if (kf.value < 0) kf.value = 0;
        if (kf.value > 1) kf.value = 1;
      }
    }
  }
}

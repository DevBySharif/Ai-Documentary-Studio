import { Timeline, TrackType } from './models';
import pino from 'pino';

const logger = pino({ name: 'timeline-validator' });

export class TimelineValidator {
  /**
   * Validates the logical structure of a Timeline.
   * Throws an error if the timeline is mathematically impossible or invalid.
   */
  static validate(timeline: Timeline): void {
    logger.debug({ timelineId: timeline.id }, 'Validating timeline');

    const trackIds = new Set<string>();

    for (const track of timeline.tracks) {
      if (trackIds.has(track.id)) {
        throw new Error(`Duplicate track ID found: ${track.id}`);
      }
      trackIds.add(track.id);

      // Validate Clips
      for (let i = 0; i < track.clips.length; i++) {
        const clip = track.clips[i];
        
        if (clip.startFrame >= clip.endFrame) {
          throw new Error(`Clip ${clip.id} has invalid timeline range: ${clip.startFrame} -> ${clip.endFrame}`);
        }
        
        if (clip.inPointFrame >= clip.outPointFrame) {
          throw new Error(`Clip ${clip.id} has invalid trim range: ${clip.inPointFrame} -> ${clip.outPointFrame}`);
        }

        // Check for overlaps on primary rigid tracks (e.g., Video, Audio where stacking isn't allowed within the same track)
        // Subtitles and Overlays might allow overlapping depending on the design, but generally single tracks don't overlap.
        // We'll enforce non-overlapping for Video and Audio tracks here.
        if (track.type === TrackType.Video || track.type === TrackType.Audio) {
          for (let j = 0; j < track.clips.length; j++) {
            if (i === j) continue;
            const otherClip = track.clips[j];
            // overlap check
            if (clip.startFrame < otherClip.endFrame && clip.endFrame > otherClip.startFrame) {
              throw new Error(`Overlapping clips detected on Track ${track.id}: Clip ${clip.id} and Clip ${otherClip.id}`);
            }
          }
        }
      }
    }

    // Update duration if necessary or validate it
    const maxEndFrame = Math.max(
      ...timeline.tracks.flatMap(t => t.clips.map(c => c.endFrame)),
      0
    );

    if (timeline.durationFrames < maxEndFrame) {
      logger.warn({ timelineId: timeline.id, maxEndFrame, durationFrames: timeline.durationFrames }, 'Timeline duration is less than the latest clip end frame. It should be extended.');
    }
  }
}

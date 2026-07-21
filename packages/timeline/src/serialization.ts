import { Timeline, TimelineSchema } from './models';
import pino from 'pino';

const logger = pino({ name: 'timeline-serialization' });

export class TimelineInterchangeFormat {
  /**
   * Serializes the in-memory Timeline state into a deterministic JSON string.
   */
  static serialize(timeline: Timeline, space = 2): string {
    // Validate schema compliance before serializing
    const parsed = TimelineSchema.parse(timeline);
    logger.debug({ timelineId: timeline.id }, 'Serialized timeline to TIF');
    return JSON.stringify(parsed, null, space);
  }

  /**
   * Deserializes a TIF JSON string back into a validated Timeline object.
   */
  static deserialize(jsonString: string): Timeline {
    const raw = JSON.parse(jsonString);
    const timeline = TimelineSchema.parse(raw);
    logger.debug({ timelineId: timeline.id }, 'Deserialized timeline from TIF');
    return timeline;
  }
}

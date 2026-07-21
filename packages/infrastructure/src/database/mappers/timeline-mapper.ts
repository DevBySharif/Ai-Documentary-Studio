import { DataMapper } from "../data-mapper";
import { Timeline } from "../../../../domain/src/models/timeline";
import { TimelineRecord } from "../persistence-models";

export class TimelineMapper implements DataMapper<Timeline, TimelineRecord> {
  public toDomain(record: TimelineRecord): Timeline {
    return {
      id: record.id,
      projectId: record.project_id,
      durationMs: record.duration_ms,
      frameRate: record.frame_rate,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      version: record.version,
    };
  }

  public toRecord(domain: Timeline): TimelineRecord {
    return {
      id: domain.id,
      project_id: domain.projectId,
      duration_ms: domain.durationMs,
      frame_rate: domain.frameRate,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
      version: domain.version,
    };
  }
}

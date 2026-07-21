import { DataMapper } from "../data-mapper";
import { Project } from "../../../../domain/src/models/project";
import { ProjectRecord } from "../persistence-models";

export class ProjectMapper implements DataMapper<Project, ProjectRecord> {
  public toDomain(record: ProjectRecord): Project {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      version: record.version,
    };
  }

  public toRecord(domain: Project): ProjectRecord {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      workspace_id: "", // resolved by caller
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
      version: domain.version,
    };
  }
}

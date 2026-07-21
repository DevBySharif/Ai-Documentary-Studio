import { ProjectRepository } from "../../../../domain/src/repositories/project-repository";
import { Project } from "../../../../domain/src/models/project";
import { DatabaseConnection } from "../migration-runner";
import { ProjectMapper } from "../mappers/project-mapper";
import { ProjectRecord } from "../persistence-models";
import { TransactionError } from "../persistence-errors";

export class SqliteProjectRepository implements ProjectRepository {
  private readonly mapper = new ProjectMapper();

  constructor(private readonly db: DatabaseConnection) {}

  public async getById(id: string): Promise<Project | undefined> {
    const record = await this.db.queryOne<ProjectRecord>(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    return record ? this.mapper.toDomain(record) : undefined;
  }

  public async findAll(): Promise<ReadonlyArray<Project>> {
    const records = await this.db.query<ProjectRecord>("SELECT * FROM projects ORDER BY created_at DESC");
    return records.map(r => this.mapper.toDomain(r));
  }

  public async findByName(name: string): Promise<Project | undefined> {
    const record = await this.db.queryOne<ProjectRecord>(
      "SELECT * FROM projects WHERE name = ?",
      [name]
    );
    return record ? this.mapper.toDomain(record) : undefined;
  }

  public async findAllByWorkspace(workspaceId: string): Promise<ReadonlyArray<Project>> {
    const records = await this.db.query<ProjectRecord>(
      "SELECT * FROM projects WHERE workspace_id = ? ORDER BY updated_at DESC",
      [workspaceId]
    );
    return records.map(r => this.mapper.toDomain(r));
  }

  public async save(entity: Project): Promise<void> {
    const record = this.mapper.toRecord(entity);
    try {
      await this.db.execute(
        `INSERT INTO projects (id, name, description, workspace_id, created_at, updated_at, version)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           description = excluded.description,
           updated_at = excluded.updated_at,
           version = excluded.version`,
        [record.id, record.name, record.description, record.workspace_id,
         record.created_at, record.updated_at, record.version]
      );
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new TransactionError("save:Project", cause);
    }
  }

  public async delete(id: string): Promise<void> {
    await this.db.execute("DELETE FROM projects WHERE id = ?", [id]);
  }

  public async exists(id: string): Promise<boolean> {
    const record = await this.db.queryOne<{ id: string }>(
      "SELECT id FROM projects WHERE id = ?",
      [id]
    );
    return record !== undefined;
  }

  public async count(): Promise<number> {
    const row = await this.db.queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM projects");
    return row?.total ?? 0;
  }
}

import { AssetRepository } from "../../../../domain/src/repositories/asset-repository";
import { Asset } from "../../../../domain/src/models/asset";
import { DatabaseConnection } from "../migration-runner";
import { AssetMapper } from "../mappers/asset-mapper";
import { AssetRecord } from "../persistence-models";
import { TransactionError } from "../persistence-errors";

export class SqliteAssetRepository implements AssetRepository {
  private readonly mapper = new AssetMapper();

  constructor(private readonly db: DatabaseConnection) {}

  public async getById(id: string): Promise<Asset | undefined> {
    const record = await this.db.queryOne<AssetRecord>(
      "SELECT * FROM assets WHERE id = ?", [id]
    );
    return record ? this.mapper.toDomain(record) : undefined;
  }

  public async findAll(): Promise<ReadonlyArray<Asset>> {
    const records = await this.db.query<AssetRecord>("SELECT * FROM assets ORDER BY created_at DESC");
    return records.map(r => this.mapper.toDomain(r));
  }

  public async findByProjectId(projectId: string): Promise<ReadonlyArray<Asset>> {
    const records = await this.db.query<AssetRecord>(
      "SELECT * FROM assets WHERE project_id = ?", [projectId]
    );
    return records.map(r => this.mapper.toDomain(r));
  }

  public async findByMimeType(mimeType: string): Promise<ReadonlyArray<Asset>> {
    const records = await this.db.query<AssetRecord>(
      "SELECT * FROM assets WHERE mime_type = ?", [mimeType]
    );
    return records.map(r => this.mapper.toDomain(r));
  }

  public async save(entity: Asset): Promise<void> {
    const record = this.mapper.toRecord(entity);
    try {
      await this.db.execute(
        `INSERT INTO assets (id, name, file_path, mime_type, size_bytes, project_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           file_path = excluded.file_path,
           mime_type = excluded.mime_type,
           size_bytes = excluded.size_bytes`,
        [record.id, record.name, record.file_path, record.mime_type,
         record.size_bytes, record.project_id, record.created_at]
      );
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new TransactionError("save:Asset", cause);
    }
  }

  public async delete(id: string): Promise<void> {
    await this.db.execute("DELETE FROM assets WHERE id = ?", [id]);
  }

  public async exists(id: string): Promise<boolean> {
    const row = await this.db.queryOne<{ id: string }>(
      "SELECT id FROM assets WHERE id = ?", [id]
    );
    return row !== undefined;
  }

  public async count(): Promise<number> {
    const row = await this.db.queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM assets");
    return row?.total ?? 0;
  }
}

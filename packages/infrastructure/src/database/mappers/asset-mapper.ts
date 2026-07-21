import { DataMapper } from "../data-mapper";
import { Asset } from "../../../../domain/src/models/asset";
import { AssetRecord } from "../persistence-models";

export class AssetMapper implements DataMapper<Asset, AssetRecord> {
  public toDomain(record: AssetRecord): Asset {
    return {
      id: record.id,
      name: record.name,
      filePath: record.file_path,
      mimeType: record.mime_type,
      sizeBytes: record.size_bytes,
      projectId: record.project_id,
      createdAt: new Date(record.created_at),
    };
  }

  public toRecord(domain: Asset): AssetRecord {
    return {
      id: domain.id,
      name: domain.name,
      file_path: domain.filePath,
      mime_type: domain.mimeType,
      size_bytes: domain.sizeBytes,
      project_id: domain.projectId,
      created_at: domain.createdAt.toISOString(),
    };
  }
}

import { Repository } from "./repository";
import { Asset } from "../models/asset";

export interface AssetRepository extends Repository<Asset, string> {
  findByProjectId(projectId: string): Promise<ReadonlyArray<Asset>>;
  findByMimeType(mimeType: string): Promise<ReadonlyArray<Asset>>;
}

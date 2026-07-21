import type { PAOutputContract, PAAssetType, PAAssetStatus } from "./types.js";

export class PAOutputContractBuilder {
  build(assetId: string, type: PAAssetType, version: number, validated: boolean, status: PAAssetStatus): PAOutputContract {
    return { assetId, type, version, validated, status };
  }
}

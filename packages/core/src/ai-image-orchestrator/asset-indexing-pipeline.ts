import { GenerationCandidate } from "./orchestrator-types";

export interface IndexedAssetRecord {
  readonly assetId: string;
  readonly sceneId: string;
  readonly shotId: string;
  readonly promptVersion: number;
  readonly provider: string;
  readonly qualityScore: number;
  readonly imageUrl: string;
  readonly tags: ReadonlyArray<string>;
  readonly isImmutable: boolean;
  readonly indexedAt: Date;
}

/**
 * Asset Indexing & Approval Pipeline (Vol 04 Part 07 - Section 16, Section 17, Section 18).
 * Indexes approved candidate images into immutable traceable production assets.
 */
export class AssetIndexingPipeline {
  private indexedAssets = new Map<string, IndexedAssetRecord>();

  public approveAndIndexAsset(
    candidate: GenerationCandidate,
    sceneId: string,
    shotId: string,
    promptVersion: number,
    tags: string[] = []
  ): IndexedAssetRecord {
    const record: IndexedAssetRecord = {
      assetId: `asset_${Math.random().toString(36).substring(2, 9)}`,
      sceneId,
      shotId,
      promptVersion,
      provider: candidate.provider,
      qualityScore: candidate.qualityScore.overallScore,
      imageUrl: candidate.imageUrl,
      tags: [...tags, candidate.provider, "ApprovedDocumentaryAsset"],
      isImmutable: true,
      indexedAt: new Date(),
    };

    this.indexedAssets.set(record.assetId, record);
    return record;
  }

  public getRecord(assetId: string): IndexedAssetRecord | undefined {
    return this.indexedAssets.get(assetId);
  }
}

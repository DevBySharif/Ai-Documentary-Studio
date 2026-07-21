import type { AssetRecord, AssetMetadata, AssetSearchQuery, AssetSearchResult, AssetHealthReport, DuplicateReport, AssetRecommendation, StorageStructure, AssetCacheEntry, AssetHealthCategory } from "./types.js";
import { SmartCollectionManager } from "./smart-collections.js";
import { MetadataDatabase } from "./metadata-db.js";
import { ImageVersionManager } from "./version-manager.js";
import { SmartSearchEngine } from "./search-engine.js";
import { DuplicateDetector } from "./duplicate-detector.js";
import { AssetHealthScorer } from "./health-scorer.js";
import { AssetRelationshipGraph } from "./relationship-graph.js";
import { SmartAssetRecommender } from "./recommender.js";

export class AssetManager {
  private collections: SmartCollectionManager;
  private metadataDb: MetadataDatabase;
  private versionManager: ImageVersionManager;
  private searchEngine: SmartSearchEngine;
  private duplicateDetector: DuplicateDetector;
  private healthScorer: AssetHealthScorer;
  private relationshipGraph: AssetRelationshipGraph;
  private recommender: SmartAssetRecommender;
  private storage: StorageStructure;
  private caches: {
    frequent: Map<string, AssetCacheEntry<AssetRecord>>;
    recent: Map<string, AssetCacheEntry<AssetRecord>>;
    project: Map<string, AssetCacheEntry<AssetRecord>>;
    similarity: Map<string, AssetCacheEntry<AssetRecord[]>>;
    thumbnails: Map<string, AssetCacheEntry<string>>;
  };

  constructor() {
    this.collections = new SmartCollectionManager();
    this.metadataDb = new MetadataDatabase();
    this.versionManager = new ImageVersionManager();
    this.searchEngine = new SmartSearchEngine();
    this.duplicateDetector = new DuplicateDetector();
    this.healthScorer = new AssetHealthScorer();
    this.relationshipGraph = new AssetRelationshipGraph();
    this.recommender = new SmartAssetRecommender();
    this.storage = {
      assetDb: new Map(),
      metadataDb: new Map(),
      embeddingDb: new Map(),
      thumbnailCache: new Map(),
      originalStorage: new Map(),
      backupStorage: new Map(),
      collections: new Map(),
    };
    this.caches = {
      frequent: new Map(),
      recent: new Map(),
      project: new Map(),
      similarity: new Map(),
      thumbnails: new Map(),
    };
  }

  register(asset: AssetRecord): void {
    if (!asset) throw new Error("AssetRecord is required");
    if (!asset.assetId) throw new Error("Asset must have an assetId");
    if (!asset.metadata) throw new Error("Asset must have metadata");

    this.storage.assetDb.set(asset.assetId, asset);
    this.storage.metadataDb.set(asset.assetId, asset.metadata);
    if (asset.embedding) {
      this.storage.embeddingDb.set(asset.assetId, asset.embedding);
    }
    this.storage.thumbnailCache.set(asset.assetId, asset.thumbnailData ?? "");
    this.storage.originalStorage.set(asset.assetId, asset.imageData ?? "");

    this.metadataDb.insert(asset.assetId, asset.metadata);
    const assigned = this.collections.autoCategorize(asset);
    asset.collections = assigned ?? [];

    this.relationshipGraph.build(this.getAllAssets());
  }

  getAsset(assetId: string): AssetRecord | undefined {
    return this.getFromCache(assetId) ?? this.storage.assetDb.get(assetId);
  }

  updateAsset(assetId: string, changes: Partial<AssetRecord>): AssetRecord | undefined {
    const asset = this.storage.assetDb.get(assetId);
    if (!asset) return undefined;

    const updated = { ...asset, ...changes, metadata: { ...asset.metadata, ...(changes.metadata ?? {}) } };
    this.storage.assetDb.set(assetId, updated);

    if (changes.metadata) {
      this.metadataDb.update(assetId, changes.metadata);
    }

    return updated;
  }

  deleteAsset(assetId: string): boolean {
    this.storage.assetDb.delete(assetId);
    this.storage.metadataDb.delete(assetId);
    this.storage.embeddingDb.delete(assetId);
    this.storage.thumbnailCache.delete(assetId);
    this.storage.originalStorage.delete(assetId);
    this.collections.removeAssetFromAll(assetId);

    return true;
  }

  search(query: AssetSearchQuery): AssetSearchResult[] {
    const assets = this.getAllAssets();
    return this.searchEngine.search(assets, query);
  }

  detectDuplicates(assetId: string): DuplicateReport[] {
    const asset = this.storage.assetDb.get(assetId);
    if (!asset) return [];
    const candidates = Array.from(this.storage.assetDb.values());
    return this.duplicateDetector.detectAll(asset, candidates);
  }

  getHealthReport(assetId: string): AssetHealthReport | undefined {
    const asset = this.storage.assetDb.get(assetId);
    if (!asset) return undefined;
    return this.healthScorer.score(asset);
  }

  getLowHealthAssets(threshold = 50): AssetRecord[] {
    return this.healthScorer.getLowHealthAssets(this.getAllAssets(), threshold);
  }

  getHighValueAssets(threshold = 80): AssetRecord[] {
    return this.healthScorer.getHighValueAssets(this.getAllAssets(), threshold);
  }

  recommendAsset(concept: string, emotion: string, style: string, threshold?: number): AssetRecommendation | null {
    return this.recommender.recommend(concept, emotion, style, this.getAllAssets(), threshold);
  }

  recommendTopK(concept: string, emotion: string, style: string, k = 3): AssetRecommendation[] {
    return this.recommender.recommendTopK(concept, emotion, style, this.getAllAssets(), k);
  }

  createVersion(assetId: string, change: string, imageData?: string): void {
    this.versionManager.createVersion(assetId, change, imageData);
  }

  getVersionHistory(assetId: string) {
    return this.versionManager.getHistory(assetId);
  }

  getRelatedAssets(assetId: string): string[] {
    return this.relationshipGraph.getRelatedAssetIds(assetId);
  }

  getAllAssets(): AssetRecord[] {
    return Array.from(this.storage.assetDb.values());
  }

  getCollectionManager(): SmartCollectionManager {
    return this.collections;
  }

  getMetadataDb(): MetadataDatabase {
    return this.metadataDb;
  }

  getVersionManager(): ImageVersionManager {
    return this.versionManager;
  }

  getSearchEngine(): SmartSearchEngine {
    return this.searchEngine;
  }

  getRelationshipGraph(): AssetRelationshipGraph {
    return this.relationshipGraph;
  }

  getStorage(): StorageStructure {
    return this.storage;
  }

  private getFromCache(assetId: string): AssetRecord | undefined {
    for (const cache of Object.values(this.caches)) {
      const entry = cache.get(assetId);
      if (entry) return entry.data as AssetRecord;
    }
    return undefined;
  }
}

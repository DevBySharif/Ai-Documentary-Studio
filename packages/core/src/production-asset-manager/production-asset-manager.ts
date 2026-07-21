import { PAAssetHierarchy } from "./asset-hierarchy.js";
import { PAAssetMetadataStore } from "./asset-metadata.js";
import { PAVersionManagement } from "./version-management.js";
import { PAAssetRelationshipGraph } from "./asset-relationship-graph.js";
import { PASmartDeduplication } from "./smart-deduplication.js";
import { PACacheManagement } from "./cache-management.js";
import { PAAssetValidation } from "./asset-validation.js";
import { PAImportSystem } from "./import-system.js";
import { PAExportSystem } from "./export-system.js";
import { PAStorageTiers } from "./storage-tiers.js";
import { PAAssetIndexing } from "./asset-indexing.js";
import { PALifecycleManagement } from "./lifecycle-management.js";
import { PASecurity } from "./security.js";
import { PAOutputContractBuilder } from "./output-contract.js";
import { PAContentHashEngine } from "./content-hash-engine.js";
import { PAAssetImpactAnalyzer } from "./asset-impact-analyzer.js";
import { PASmartStorageOptimizer } from "./smart-storage-optimizer.js";
import { PAAIAssetClassifier } from "./ai-asset-classifier.js";
import { PAAssetLineageTracker } from "./asset-lineage-tracker.js";

export class PAProductionAssetManager {
  readonly hierarchy: PAAssetHierarchy;
  readonly metadataStore: PAAssetMetadataStore;
  readonly versionManagement: PAVersionManagement;
  readonly relationshipGraph: PAAssetRelationshipGraph;
  readonly deduplication: PASmartDeduplication;
  readonly cacheManagement: PACacheManagement;
  readonly validation: PAAssetValidation;
  readonly importSystem: PAImportSystem;
  readonly exportSystem: PAExportSystem;
  readonly storageTiers: PAStorageTiers;
  readonly indexing: PAAssetIndexing;
  readonly lifecycle: PALifecycleManagement;
  readonly security: PASecurity;
  readonly outputContractBuilder: PAOutputContractBuilder;
  readonly contentHashEngine: PAContentHashEngine;
  readonly impactAnalyzer: PAAssetImpactAnalyzer;
  readonly storageOptimizer: PASmartStorageOptimizer;
  readonly aiClassifier: PAAIAssetClassifier;
  readonly lineageTracker: PAAssetLineageTracker;

  constructor() {
    this.hierarchy = new PAAssetHierarchy();
    this.metadataStore = new PAAssetMetadataStore();
    this.versionManagement = new PAVersionManagement();
    this.relationshipGraph = new PAAssetRelationshipGraph();
    this.deduplication = new PASmartDeduplication();
    this.cacheManagement = new PACacheManagement();
    this.validation = new PAAssetValidation();
    this.importSystem = new PAImportSystem();
    this.exportSystem = new PAExportSystem();
    this.storageTiers = new PAStorageTiers();
    this.indexing = new PAAssetIndexing();
    this.lifecycle = new PALifecycleManagement();
    this.security = new PASecurity();
    this.outputContractBuilder = new PAOutputContractBuilder();
    this.contentHashEngine = new PAContentHashEngine();
    this.impactAnalyzer = new PAAssetImpactAnalyzer();
    this.storageOptimizer = new PASmartStorageOptimizer();
    this.aiClassifier = new PAAIAssetClassifier();
    this.lineageTracker = new PAAssetLineageTracker();
  }
}

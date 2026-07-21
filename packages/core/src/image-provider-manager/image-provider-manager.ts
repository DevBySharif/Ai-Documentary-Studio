import { IPProviderAbstraction } from "./provider-abstraction";
import { IPPromptAdaptationEngine } from "./prompt-adaptation-engine";
import { IPStyleLockSystem } from "./style-lock-system";
import { IPCharacterConsistency } from "./character-consistency";
import { IPSeedManager } from "./seed-manager";
import { IPQualityProfiles } from "./quality-profiles";
import { IPRetryStrategy } from "./retry-strategy";
import { IPImageCache } from "./image-cache";
import { IPProviderHealthMonitor } from "./provider-health-monitor";
import { IPImageValidation } from "./image-validation";
import { IPCostTracking } from "./cost-tracking";
import { IPProviderSettings } from "./provider-settings";
import { IPOutputContractBuilder } from "./output-contract";
import { IPImageConsistencyAI } from "./image-consistency-ai";
import { IPSmartImageReuseEngine } from "./smart-image-reuse-engine";
import { IPProviderBenchmarkDatabase } from "./provider-benchmark-database";
import { IPReferenceAssetSystem } from "./reference-asset-system";
import { IPChannelDNAStyleEnforcer } from "./channel-dna-style-enforcer";

export class IPImageProviderManager {
  public readonly providerAbstraction: IPProviderAbstraction;
  public readonly promptAdaptationEngine: IPPromptAdaptationEngine;
  public readonly styleLockSystem: IPStyleLockSystem;
  public readonly characterConsistency: IPCharacterConsistency;
  public readonly seedManager: IPSeedManager;
  public readonly qualityProfiles: IPQualityProfiles;
  public readonly retryStrategy: IPRetryStrategy;
  public readonly imageCache: IPImageCache;
  public readonly providerHealthMonitor: IPProviderHealthMonitor;
  public readonly imageValidation: IPImageValidation;
  public readonly costTracking: IPCostTracking;
  public readonly providerSettings: IPProviderSettings;
  public readonly outputContractBuilder: IPOutputContractBuilder;
  public readonly imageConsistencyAI: IPImageConsistencyAI;
  public readonly smartImageReuseEngine: IPSmartImageReuseEngine;
  public readonly providerBenchmarkDatabase: IPProviderBenchmarkDatabase;
  public readonly referenceAssetSystem: IPReferenceAssetSystem;
  public readonly channelDNAStyleEnforcer: IPChannelDNAStyleEnforcer;

  constructor() {
    this.providerAbstraction = new IPProviderAbstraction();
    this.promptAdaptationEngine = new IPPromptAdaptationEngine();
    this.styleLockSystem = new IPStyleLockSystem();
    this.characterConsistency = new IPCharacterConsistency();
    this.seedManager = new IPSeedManager();
    this.qualityProfiles = new IPQualityProfiles();
    this.retryStrategy = new IPRetryStrategy();
    this.imageCache = new IPImageCache();
    this.providerHealthMonitor = new IPProviderHealthMonitor();
    this.imageValidation = new IPImageValidation();
    this.costTracking = new IPCostTracking();
    this.providerSettings = new IPProviderSettings();
    this.outputContractBuilder = new IPOutputContractBuilder();
    this.imageConsistencyAI = new IPImageConsistencyAI();
    this.smartImageReuseEngine = new IPSmartImageReuseEngine();
    this.providerBenchmarkDatabase = new IPProviderBenchmarkDatabase();
    this.referenceAssetSystem = new IPReferenceAssetSystem();
    this.channelDNAStyleEnforcer = new IPChannelDNAStyleEnforcer();
  }
}

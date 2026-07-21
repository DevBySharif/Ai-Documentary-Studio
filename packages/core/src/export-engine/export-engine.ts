import type { EEPlatform, EEFormat, EEVideoCodec, EEAudioCodec, EEResolution, EEFramerate, EEOutputContract, EEValidationResult, EEMetadata, EEArchivePackage, EEAIExportDecision, EEPlatformPreset, EEZennProfile } from "./types.js";
import { EEExportFormats } from "./export-formats.js";
import { EEVideoCodecs } from "./video-codecs.js";
import { EEAudioCodecs } from "./audio-codecs.js";
import { EEPlatformPresets } from "./platform-presets.js";
import { EEResolutionProfiles } from "./resolution-profiles.js";
import { EEFrameRateProfiles } from "./frame-rate-profiles.js";
import { EEBitrateManager } from "./bitrate-manager.js";
import { EEMetadataEmbedding } from "./metadata-embedding.js";
import { EEThumbnailExport } from "./thumbnail-export.js";
import { EEProjectArchive } from "./project-archive.js";
import { EEVersionManager } from "./version-manager.js";
import { EEAIExportOptimizer } from "./ai-export-optimizer.js";
import { EEMultiDestinationExport } from "./multi-destination-export.js";
import { EEExportManifest } from "./export-manifest.js";
import { EESmartDeliveryPackager } from "./smart-delivery-packager.js";
import { EEZennExportProfile } from "./zenn-export-profile.js";
import { EEExportValidator } from "./validator.js";
import { EEOutputContractBuilder } from "./output-contract.js";

export class EEExportEngine {
  readonly formats: EEExportFormats;
  readonly videoCodecs: EEVideoCodecs;
  readonly audioCodecs: EEAudioCodecs;
  readonly platformPresets: EEPlatformPresets;
  readonly resolutions: EEResolutionProfiles;
  readonly frameRates: EEFrameRateProfiles;
  readonly bitrateManager: EEBitrateManager;
  readonly metadata: EEMetadataEmbedding;
  readonly thumbnails: EEThumbnailExport;
  readonly archive: EEProjectArchive;
  readonly versions: EEVersionManager;
  readonly aiOptimizer: EEAIExportOptimizer;
  readonly multiDest: EEMultiDestinationExport;
  readonly manifest: EEExportManifest;
  readonly packager: EESmartDeliveryPackager;
  readonly zennProfile: EEZennExportProfile;
  readonly validator: EEExportValidator;
  readonly outputContract: EEOutputContractBuilder;

  constructor() {
    this.formats = new EEExportFormats();
    this.videoCodecs = new EEVideoCodecs();
    this.audioCodecs = new EEAudioCodecs();
    this.platformPresets = new EEPlatformPresets();
    this.resolutions = new EEResolutionProfiles();
    this.frameRates = new EEFrameRateProfiles();
    this.bitrateManager = new EEBitrateManager();
    this.metadata = new EEMetadataEmbedding();
    this.thumbnails = new EEThumbnailExport();
    this.archive = new EEProjectArchive();
    this.versions = new EEVersionManager();
    this.aiOptimizer = new EEAIExportOptimizer();
    this.multiDest = new EEMultiDestinationExport();
    this.manifest = new EEExportManifest();
    this.packager = new EESmartDeliveryPackager();
    this.zennProfile = new EEZennExportProfile();
    this.validator = new EEExportValidator();
    this.outputContract = new EEOutputContractBuilder();
  }

  applyZennDefaults(): void {
    const profile = this.zennProfile.getProfile();
  }

  exportToPlatform(platform: EEPlatform): { preset: EEPlatformPreset; contract: EEOutputContract } {
    const preset = this.platformPresets.getPreset(platform);
    const contract = this.outputContract.build(preset.format, preset.videoCodec, preset.resolution, preset.framerate, platform, true);
    return { preset, contract };
  }
}

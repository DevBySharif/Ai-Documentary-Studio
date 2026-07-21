import { ASSettingsHierarchy } from './settings-hierarchy';
import { ASSettingsCategories } from './settings-categories';
import { ASGeneralSettings } from './general-settings';
import { ASAIProviderSettings } from './ai-provider-settings';
import { ASImageProviderSettings } from './image-provider-settings';
import { ASVoiceProviderSettings } from './voice-provider-settings';
import { ASRenderSettings } from './render-settings';
import { ASPerformanceSettings } from './performance-settings';
import { ASCacheSettings } from './cache-settings';
import { ASAppearance } from './appearance';
import { ASKeyboardShortcuts } from './keyboard-shortcuts';
import { ASBackupRecovery } from './backup-recovery';
import { ASSecuritySettings } from './security-settings';
import { ASSettingsValidation } from './settings-validation';
import { ASSettingsImportExport } from './settings-import-export';
import { ASSettingsSearch } from './settings-search';
import { ASOutputContractBuilder } from './output-contract';
import { ASSettingsProfileManager } from './settings-profile-manager';
import { ASSmartSettingsRecommender } from './smart-settings-recommender';
import { ASConfigurationHistory } from './configuration-history';
import { ASLiveConfigurationPreview } from './live-configuration-preview';
import { ASPolicyLocks } from './policy-locks';

export class ASApplicationSettings {
  public readonly hierarchy: ASSettingsHierarchy;
  public readonly categories: ASSettingsCategories;
  public readonly general: ASGeneralSettings;
  public readonly aiProvider: ASAIProviderSettings;
  public readonly imageProvider: ASImageProviderSettings;
  public readonly voiceProvider: ASVoiceProviderSettings;
  public readonly render: ASRenderSettings;
  public readonly performance: ASPerformanceSettings;
  public readonly cache: ASCacheSettings;
  public readonly appearance: ASAppearance;
  public readonly shortcuts: ASKeyboardShortcuts;
  public readonly backup: ASBackupRecovery;
  public readonly security: ASSecuritySettings;
  public readonly validation: ASSettingsValidation;
  public readonly importExport: ASSettingsImportExport;
  public readonly search: ASSettingsSearch;
  public readonly outputContract: ASOutputContractBuilder;
  public readonly profileManager: ASSettingsProfileManager;
  public readonly recommender: ASSmartSettingsRecommender;
  public readonly history: ASConfigurationHistory;
  public readonly preview: ASLiveConfigurationPreview;
  public readonly policyLocks: ASPolicyLocks;

  constructor() {
    this.hierarchy = new ASSettingsHierarchy();
    this.categories = new ASSettingsCategories();
    this.general = new ASGeneralSettings();
    this.aiProvider = new ASAIProviderSettings();
    this.imageProvider = new ASImageProviderSettings();
    this.voiceProvider = new ASVoiceProviderSettings();
    this.render = new ASRenderSettings();
    this.performance = new ASPerformanceSettings();
    this.cache = new ASCacheSettings();
    this.appearance = new ASAppearance();
    this.shortcuts = new ASKeyboardShortcuts();
    this.backup = new ASBackupRecovery();
    this.security = new ASSecuritySettings();
    this.validation = new ASSettingsValidation();
    this.importExport = new ASSettingsImportExport();
    this.search = new ASSettingsSearch();
    this.outputContract = new ASOutputContractBuilder();
    this.profileManager = new ASSettingsProfileManager();
    this.recommender = new ASSmartSettingsRecommender();
    this.history = new ASConfigurationHistory();
    this.preview = new ASLiveConfigurationPreview();
    this.policyLocks = new ASPolicyLocks();
  }

  toJSON(): Record<string, unknown> {
    return {
      general: this.general.getAll(),
      aiProvider: this.aiProvider.getAll(),
      imageProvider: this.imageProvider.getAll(),
      voiceProvider: this.voiceProvider.getAll(),
      render: this.render.getAll(),
      performance: this.performance.getAll(),
      cache: this.cache.getAll(),
      appearance: this.appearance.getAll(),
      shortcuts: this.shortcuts.getAllShortcuts(),
      backup: this.backup.getAll(),
      security: this.security.getAll(),
    };
  }

  exportAllSettings(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

import { VPProviderAbstraction } from "./provider-abstraction";
import { VPVoiceRoutingEngine } from "./voice-routing-engine";
import { VPVoiceProfileSystem } from "./voice-profile-system";
import { VPPronunciationDictionary } from "./pronunciation-dictionary";
import { VPSSMLSupport } from "./ssml-support";
import { VPEmotionControl } from "./emotion-control";
import { VPTimingAlignment } from "./timing-alignment";
import { VPFallbackStrategy } from "./fallback-strategy";
import { VPVoiceCache } from "./voice-cache";
import { VPQualityValidation } from "./quality-validation";
import { VPMultiLanguageSupport } from "./multi-language-support";
import { VPProviderSettings } from "./provider-settings";
import { VPOutputContractBuilder } from "./output-contract";
import { VPAIVoiceQualityAnalyzer } from "./ai-voice-quality-analyzer";
import { VPVoiceConsistencyEngine } from "./voice-consistency-engine";
import { VPHybridNarrationMode } from "./hybrid-narration-mode";
import { VPVoiceCloningReadiness } from "./voice-cloning-readiness";
import { VPChannelDNAVoiceEnforcer } from "./channel-dna-voice-enforcer";

export class VPVoiceProviderManager {
  public readonly providerAbstraction: VPProviderAbstraction;
  public readonly voiceRoutingEngine: VPVoiceRoutingEngine;
  public readonly voiceProfileSystem: VPVoiceProfileSystem;
  public readonly pronunciationDictionary: VPPronunciationDictionary;
  public readonly ssmlSupport: VPSSMLSupport;
  public readonly emotionControl: VPEmotionControl;
  public readonly timingAlignment: VPTimingAlignment;
  public readonly fallbackStrategy: VPFallbackStrategy;
  public readonly voiceCache: VPVoiceCache;
  public readonly qualityValidation: VPQualityValidation;
  public readonly multiLanguageSupport: VPMultiLanguageSupport;
  public readonly providerSettings: VPProviderSettings;
  public readonly outputContractBuilder: VPOutputContractBuilder;
  public readonly aiVoiceQualityAnalyzer: VPAIVoiceQualityAnalyzer;
  public readonly voiceConsistencyEngine: VPVoiceConsistencyEngine;
  public readonly hybridNarrationMode: VPHybridNarrationMode;
  public readonly voiceCloningReadiness: VPVoiceCloningReadiness;
  public readonly channelDNAVoiceEnforcer: VPChannelDNAVoiceEnforcer;

  constructor() {
    this.providerAbstraction = new VPProviderAbstraction();
    this.voiceRoutingEngine = new VPVoiceRoutingEngine();
    this.voiceProfileSystem = new VPVoiceProfileSystem();
    this.pronunciationDictionary = new VPPronunciationDictionary();
    this.ssmlSupport = new VPSSMLSupport();
    this.emotionControl = new VPEmotionControl();
    this.timingAlignment = new VPTimingAlignment();
    this.fallbackStrategy = new VPFallbackStrategy();
    this.voiceCache = new VPVoiceCache();
    this.qualityValidation = new VPQualityValidation();
    this.multiLanguageSupport = new VPMultiLanguageSupport(
      this.voiceProfileSystem,
      this.providerAbstraction
    );
    this.providerSettings = new VPProviderSettings();
    this.outputContractBuilder = new VPOutputContractBuilder();
    this.aiVoiceQualityAnalyzer = new VPAIVoiceQualityAnalyzer();
    this.voiceConsistencyEngine = new VPVoiceConsistencyEngine();
    this.hybridNarrationMode = new VPHybridNarrationMode(this.providerAbstraction);
    this.voiceCloningReadiness = new VPVoiceCloningReadiness();
    this.channelDNAVoiceEnforcer = new VPChannelDNAVoiceEnforcer();
  }
}

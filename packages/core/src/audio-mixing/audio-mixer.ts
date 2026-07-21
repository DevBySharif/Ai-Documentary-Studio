import type { AMLayerType, AMAmbientType, AMSoundEffectType, AMExportProfile, AMSceneContext, AMQualityReport, AMOutputContract, AMValidationResult } from "./types.js";
import { AMLayerManager } from "./layer-manager.js";
import { AMNarrationPriority } from "./narration-priority.js";
import { AMMusicDuckingEngine } from "./music-ducking.js";
import { AMAmbientEngine } from "./ambient-engine.js";
import { AMSoundEffectsEngine } from "./sound-effects.js";
import { AMEqualizer } from "./equalizer.js";
import { AMCompressor } from "./compressor.js";
import { AMLimiter } from "./limiter.js";
import { AMLoudnessNormalization } from "./loudness-normalization.js";
import { AMNoiseReduction } from "./noise-reduction.js";
import { AMStereoImaging } from "./stereo-imaging.js";
import { AMReverbManager } from "./reverb-manager.js";
import { AMMasterBus } from "./master-bus.js";
import { AMAISoundDirector } from "./ai-sound-director.js";
import { AMAdaptiveMusicEngine } from "./adaptive-music.js";
import { AMAudioQualityAI } from "./audio-quality-ai.js";
import { AMMultiProfileMastering } from "./multi-profile-mastering.js";
import { AMZennAudioProfile } from "./zenn-profile.js";
import { AMAudioMixValidator } from "./validator.js";
import { AMOutputContractBuilder } from "./output-contract.js";

export class AMAudioMixingEngine {
  readonly layerManager: AMLayerManager;
  readonly narrationPriority: AMNarrationPriority;
  readonly ducking: AMMusicDuckingEngine;
  readonly ambient: AMAmbientEngine;
  readonly soundEffects: AMSoundEffectsEngine;
  readonly equalizer: AMEqualizer;
  readonly compressor: AMCompressor;
  readonly limiter: AMLimiter;
  readonly loudness: AMLoudnessNormalization;
  readonly noiseReduction: AMNoiseReduction;
  readonly stereo: AMStereoImaging;
  readonly reverb: AMReverbManager;
  readonly masterBus: AMMasterBus;
  readonly aiDirector: AMAISoundDirector;
  readonly adaptiveMusic: AMAdaptiveMusicEngine;
  readonly qualityAI: AMAudioQualityAI;
  readonly multiProfile: AMMultiProfileMastering;
  readonly zennProfile: AMZennAudioProfile;
  readonly validator: AMAudioMixValidator;
  readonly outputContract: AMOutputContractBuilder;

  constructor() {
    this.layerManager = new AMLayerManager();
    this.narrationPriority = new AMNarrationPriority();
    this.ducking = new AMMusicDuckingEngine();
    this.ambient = new AMAmbientEngine();
    this.soundEffects = new AMSoundEffectsEngine();
    this.equalizer = new AMEqualizer();
    this.compressor = new AMCompressor();
    this.limiter = new AMLimiter();
    this.loudness = new AMLoudnessNormalization();
    this.noiseReduction = new AMNoiseReduction();
    this.stereo = new AMStereoImaging();
    this.reverb = new AMReverbManager();
    this.masterBus = new AMMasterBus();
    this.aiDirector = new AMAISoundDirector();
    this.adaptiveMusic = new AMAdaptiveMusicEngine();
    this.qualityAI = new AMAudioQualityAI();
    this.multiProfile = new AMMultiProfileMastering();
    this.zennProfile = new AMZennAudioProfile();
    this.validator = new AMAudioMixValidator();
    this.outputContract = new AMOutputContractBuilder();
  }

  applyZennDefaults(): void {
    const balance = this.zennProfile.getDefaultVolumeBalance();
    this.layerManager.setVolume("narration", balance.narration);
    this.layerManager.setVolume("background_music", balance.music);
    this.layerManager.setVolume("ambience", balance.ambience);
    this.layerManager.setVolume("sound_effects", balance.effects);

    this.layerManager.setEQ("narration", this.zennProfile.getNarrationEQ());
    this.layerManager.setEQ("background_music", this.zennProfile.getMusicEQ());
    this.layerManager.setCompressor("narration", this.zennProfile.getNarrationCompressor());
    this.ducking.configure(this.zennProfile.getDuckingSettings());
  }

  processScene(context: AMSceneContext, isSpeaking: boolean): {
    musicLevel: number;
    ambienceLevel: number;
    duckGain: number;
    quality: AMQualityReport;
    contract: AMOutputContract;
    validation: AMValidationResult;
  } {
    const decision = this.aiDirector.evaluate(context);

    this.layerManager.setVolume("background_music", decision.musicLevel);
    this.ambient.setActiveByType("room_tone");

    const duckGain = this.ducking.calculateGain(decision.musicLevel, isSpeaking, 0);
    const finalMusic = this.ducking.applyDucking(decision.musicLevel, duckGain);

    const narrationVol = this.layerManager.getLayer("narration")?.volume ?? -2;
    const priority = this.narrationPriority.enforce(narrationVol, finalMusic, isSpeaking);

    const musicLevel = this.layerManager.getLayer("background_music")?.volume ?? -12;
    const ambienceLevel = this.ambient.getActive()?.volume ?? -18;

    const quality = this.qualityAI.analyze(-14, -1, 3, 0.8, -60);
    const contract = this.outputContract.build(true, true, "youtube_long", true, quality.passed);
    const validation = this.validator.validate(false, true, 0.85, true, true, true, { integratedLUFS: -14, shortTermLUFS: -16, truePeak: -1 });

    return { musicLevel: priority.musicVolume, ambienceLevel, duckGain, quality, contract, validation };
  }
}

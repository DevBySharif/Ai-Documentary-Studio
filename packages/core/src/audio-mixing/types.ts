export type AMLayerType = "narration" | "background_music" | "ambience" | "sound_effects" | "transition_effects" | "master_bus";

export type AMAmbientType = "room_tone" | "wind" | "rain" | "forest" | "city" | "space" | "ocean";

export type AMSoundEffectType = "whoosh" | "transition" | "impact" | "click" | "page_turn" | "light_atmosphere";

export type AMEQBand = "sub" | "low" | "low_mid" | "mid" | "high_mid" | "high";

export type AMNoiseType = "background" | "hum" | "static" | "low_rumble";

export type AMStereoMode = "mono" | "stereo" | "dual_mono";

export type AMReverbType = "room" | "hall" | "plate" | "chamber" | "none";

export type AMExportProfile = "youtube_long" | "youtube_shorts" | "podcast" | "instagram_reels" | "tiktok" | "local_archive_lossless";

export type AMSceneEmotion = "reflection" | "discovery" | "tension" | "revelation" | "hope" | "fear" | "wonder" | "calm" | "urgency";

export interface AMLayerConfig {
  type: AMLayerType;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  eq: AMEQSettings;
  compressor: AMCompressorSettings;
}

export interface AMEQSettings {
  sub: number;
  low: number;
  low_mid: number;
  mid: number;
  high_mid: number;
  high: number;
  enabled: boolean;
}

export interface AMCompressorSettings {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
  makeupGain: number;
  enabled: boolean;
}

export interface AMLimiterSettings {
  ceiling: number;
  attack: number;
  release: number;
  enabled: boolean;
}

export interface AMLoudnessTarget {
  integratedLUFS: number;
  shortTermLUFS: number;
  truePeak: number;
}

export interface AMNoiseReductionSettings {
  type: AMNoiseType;
  reduction: number;
  enabled: boolean;
}

export interface AMReverbSettings {
  type: AMReverbType;
  mix: number;
  decay: number;
  preDelay: number;
  enabled: boolean;
}

export interface AMMusicDuckingSettings {
  threshold: number;
  reduction: number;
  attack: number;
  release: number;
  enabled: boolean;
}

export interface AMAmbientConfig {
  type: AMAmbientType;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface AMSoundEffectConfig {
  type: AMSoundEffectType;
  volume: number;
  timing: { start: number; end: number };
}

export interface AMSceneContext {
  emotion: AMSceneEmotion;
  narrationIntensity: number;
  cameraMovement: "static" | "slow" | "moderate" | "fast";
  visualComplexity: number;
  silenceDuration: number;
}

export interface AMAdaptiveMusicSegment {
  id: string;
  source: string;
  startTime: number;
  endTime: number;
  energy: number;
  emotion: string;
  introFade: number;
  outroFade: number;
  crossfade: number;
}

export interface AMQualityReport {
  clipping: boolean;
  excessiveCompression: boolean;
  harshFrequencies: boolean;
  voiceMasking: boolean;
  loudnessInconsistencies: boolean;
  noiseArtifacts: boolean;
  overallScore: number;
  passed: boolean;
  recommendations: string[];
}

export interface AMMasterProfile {
  format: string;
  codec: string;
  sampleRate: number;
  bitDepth: number;
  bitrate: string;
  loudness: AMLoudnessTarget;
}

export interface AMValidationResult {
  noClipping: boolean;
  loudnessTarget: boolean;
  voiceClarity: boolean;
  duckingAccuracy: boolean;
  stereoCompatibility: boolean;
  noiseLevel: boolean;
  passed: boolean;
}

export interface AMOutputContract {
  voice: string;
  music: string;
  loudness: string;
  truePeak: string;
  status: string;
}

export interface AMAISoundDirectorDecision {
  musicLevel: number;
  ambienceIntensity: number;
  duckingDepth: number;
  transitionSounds: boolean;
  dynamicRange: number;
}

export interface AMZennProfile {
  narration: { warm: boolean; natural: boolean };
  music: { soft: boolean; cinematic: boolean };
  ambience: { subtle: boolean };
  ducking: { gentle: boolean; automatic: boolean };
  compression: { minimal: boolean };
  eq: { clean: boolean };
  overall: { comfortable: boolean; longForm: boolean };
}

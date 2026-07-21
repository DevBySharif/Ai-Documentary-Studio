import type { EmotionTag } from "../story/types.js";

export type TTSProviderName = "kokoro" | "piper" | "edge_tts" | "openai" | "google" | "elevenlabs";

export interface TTSConfig {
  provider: TTSProviderName;
  voice: string;
  speed: number;
  pitch: number;
  language: string;
}

export interface VoiceDNAProfile {
  voiceModel: string;
  gender: "male" | "female" | "neutral";
  speakingStyle: string;
  speechRate: number;
  pitch: number;
  energy: number;
  accent: string;
  pauseStyle: "few" | "normal" | "many";
}

export interface AudioNormalizationConfig {
  targetLoudness: number;
  peakLevel: number;
  noiseFloor: number;
  sampleRate: number;
  channelFormat: "mono" | "stereo";
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  confidence: number;
  vocalEnergy?: number;
  isEmphasized?: boolean;
}

export interface Phrase {
  text: string;
  words: WordTimestamp[];
  start: number;
  end: number;
}

export interface Pause {
  start: number;
  end: number;
  duration: number;
  type: "natural" | "long" | "dramatic" | "sentence_break" | "paragraph_break";
}

export interface Silence {
  start: number;
  end: number;
  duration: number;
  type: "reflection" | "dramatic" | "ending" | "breathing";
}

export interface SpeechRateMetrics {
  wordsPerMinute: number;
  wordsPerSecond: number;
  speakingSpeed: "slow" | "normal" | "fast";
  averagePauseLength: number;
  speechRhythm: "steady" | "varied" | "irregular";
}

export type VoiceEmotion = "calm" | "curious" | "fearful" | "excited" | "reflective" | "confident" | "urgent" | "inspirational";

export interface EmphasisWord {
  word: string;
  start: number;
  end: number;
  vocalEnergy: number;
  triggerWordVisual: boolean;
  triggerPushIn: boolean;
  triggerSubtitleEmphasis: boolean;
}

export interface AudioQualityReport {
  clipping: boolean;
  backgroundNoise: number;
  loudnessConsistency: number;
  timingComplete: boolean;
  missingTimestamps: string[];
  corrupted: boolean;
  passed: boolean;
  score: number;
}

export interface SubtitleBlock {
  index: number;
  start: number;
  end: number;
  text: string;
  emotion: EmotionTag;
  highlightedWords: string[];
}

export interface SyncPoint {
  timestamp: number;
  type: "image_change" | "motion_start" | "motion_end" | "word_insert" | "transition" | "subtitle_highlight" | "pause" | "silence";
  data?: Record<string, unknown>;
}

export interface MasterTimelineEntry {
  time: number;
  action: string;
  duration: number;
  detail: string;
}

export interface AudioMasterTimeline {
  entries: MasterTimelineEntry[];
  totalDuration: number;
}

export interface AudioMemoryEntry {
  voiceProfileId: string;
  previousNarration: string[];
  speechRhythm: SpeechRateMetrics;
  preferredPacing: number;
  pronunciationOverrides: Map<string, string>;
}

export interface SemanticAudioSegment {
  start: number;
  end: number;
  text: string;
  dominantConcept: string;
  emotion: EmotionTag;
  importance: number;
  imageStrategy: "reuse" | "new" | "word_insert";
  suggestedMotion: string;
  transitionPreference: string;
}

export interface AudioMetadata {
  duration: number;
  language: string;
  speechRate: number;
  averagePause: number;
  confidence: number;
}

export interface WhisperResult {
  text: string;
  language: string;
  words: WordTimestamp[];
  phrases: Phrase[];
  sentences: Array<{ text: string; start: number; end: number }>;
  pauses: Pause[];
  silences: Silence[];
  confidence: number;
  metadata: AudioMetadata;
}

export interface AudioIntelligenceResult {
  whisper: WhisperResult;
  speechRate: SpeechRateMetrics;
  voiceEmotion: VoiceEmotion;
  emphasis: EmphasisWord[];
  quality: AudioQualityReport;
  subtitles: SubtitleBlock[];
  syncPoints: SyncPoint[];
  masterTimeline: AudioMasterTimeline;
  semanticMap: SemanticAudioSegment[];
  metadata: AudioMetadata;
}

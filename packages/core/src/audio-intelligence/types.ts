export interface AIntWord {
  text: string;
  start: number;
  end: number;
  confidence: number;
  stress: number;
}

export interface AIntPhrase {
  text: string;
  words: AIntWord[];
  start: number;
  end: number;
}

export interface AIntSentence {
  text: string;
  start: number;
  end: number;
  duration: number;
  importance: number;
  narrativeRole: string;
}

export interface AIntPause {
  start: number;
  end: number;
  duration: number;
  type: "natural" | "breath" | "silent_gap" | "reflection";
}

export interface AIntEmphasis {
  word: string;
  frame: number;
  pitch: number;
  volume: number;
  duration: number;
  speechRate: number;
  score: number;
}

export interface AIntEmotionSegment {
  start: number;
  end: number;
  emotion: "curiosity" | "hope" | "fear" | "wonder" | "reflection" | "urgency" | "neutral";
  confidence: number;
}

export interface AIntSpeechRate {
  wordsPerMinute: number;
  syllablesPerSecond: number;
  sentenceSpeed: number;
  informationDensity: number;
}

export interface AIntSilence {
  start: number;
  end: number;
  duration: number;
  type: "intentional" | "recording" | "noise_floor" | "transition";
}

export interface AIntTranscriptionResult {
  words: AIntWord[];
  phrases: AIntPhrase[];
  sentences: AIntSentence[];
  duration: number;
  alignmentAccuracy: number;
}

export interface AIntTTSConfig {
  provider: "piper" | "kokoro" | "coqui" | "edge_tts" | "google_cloud" | "elevenlabs";
  voice: string;
  speed: number;
  pitch: number;
  language: string;
}

export interface AIntAudioQuality {
  loudness: number;
  noise: number;
  clipping: boolean;
  dynamicRange: number;
  pronunciationConfidence: number;
  voiceConsistency: number;
  passed: boolean;
}

export interface AIntDuckingConfig {
  reductionDb: number;
  attackMs: number;
  releaseMs: number;
  thresholdDb: number;
}

export interface AIntNormalizationConfig {
  targetLUFS: number;
  peakLimit: number;
  limiter: boolean;
  compressor: boolean;
  noiseReduction: boolean;
}

export interface AIntSemanticAudioMap {
  words: AIntWord[];
  emotion: AIntEmotionSegment[];
  emphasis: AIntEmphasis[];
  pauses: AIntPause[];
  phrases: AIntPhrase[];
  sentences: AIntSentence[];
}

export interface AIntBreathEvent {
  start: number;
  end: number;
  type: "natural_breathing" | "emotional_pause" | "dramatic_inhale" | "reflection_pause";
  intensity: number;
}

export interface AIntEvent {
  type: "WordStarted" | "PhraseStarted" | "SentenceStarted" | "PauseStarted" | "EmphasisDetected" | "EmotionChanged" | "SentenceEnded";
  timestamp: number;
  data: Record<string, unknown>;
}

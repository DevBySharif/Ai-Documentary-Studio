export type VPProviderName =
  | "edge_tts"
  | "piper"
  | "kokoro"
  | "google_cloud_tts"
  | "azure_speech"
  | "elevenlabs"
  | "openai_tts"
  | "amazon_polly"
  | "coqui"
  | "cartesia"
  | "playht"
  | "local_neural";

export type VPLanguage =
  | "english"
  | "bangla"
  | "hindi"
  | "arabic"
  | "japanese"
  | "korean"
  | "chinese";

export type VPSpeakingStyle =
  | "neutral"
  | "documentary"
  | "conversational"
  | "dramatic"
  | "inspirational";

export type VPEmotion =
  | "calm"
  | "inspirational"
  | "serious"
  | "dramatic"
  | "curious"
  | "neutral"
  | "confident";

export type VPHealthStatus = "healthy" | "degraded" | "unavailable";

export interface VPNarrationRequest {
  script: string;
  language: VPLanguage;
  voiceId: string;
  speakingStyle: VPSpeakingStyle;
  speed: number;
  pitch: number;
  emotionProfile: VPEmotion;
  ssml: string;
  channelDnaVersion: string;
  outputFormat: string;
}

export interface VPNarrationResult {
  narrationId: string;
  provider: VPProviderName;
  voiceId: string;
  language: VPLanguage;
  duration: number;
  timingData: VPTimingData;
  ssml: string;
  validated: boolean;
  status: "pending" | "completed" | "failed" | "partial";
  cost: number;
}

export interface VPTimingData {
  sentenceTimestamps: { start: number; end: number; text: string }[];
  phraseTimestamps: { start: number; end: number; text: string }[];
  wordTimestamps: { start: number; end: number; word: string }[];
}

export interface VPVoiceProfile {
  voiceName: string;
  gender: "male" | "female" | "neutral";
  accent: string;
  language: VPLanguage;
  speakingStyle: VPSpeakingStyle;
  speedRange: { min: number; max: number };
  emotionalRange: VPEmotion[];
  supportedFeatures: string[];
}

export interface VPPronunciationRule {
  text: string;
  pronunciation: string;
  language: VPLanguage;
  category: "technical" | "brand" | "historical" | "scientific" | "foreign";
}

export interface VPBenchmark {
  provider: VPProviderName;
  naturalness: number;
  rhythm: number;
  emotionalConsistency: number;
  pronunciationConfidence: number;
  artifactScore: number;
  costEfficiency: number;
}

export interface VPOutputContract {
  provider: VPProviderName;
  voice: string;
  language: VPLanguage;
  duration: number;
  timing: "word" | "phrase" | "sentence";
  status: "delivered" | "pending" | "rejected";
}

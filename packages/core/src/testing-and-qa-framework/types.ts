export interface QualityMetrics {
  resolution: string;
  aspectRatio: string;
  characterConsistency: number;
  styleConsistency: number;
  artifactDetection: number;
  promptAdherence: number;
}

export interface VoiceMetrics {
  pronunciationScore: number;
  audioClipping: boolean;
  emotionConsistency: number;
  speakingRate: string; // e.g. "Normal", "Fast"
  timestampAccuracy: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TestReport {
  id: string;
  timestamp: string;
  suiteName: string;
  passed: number;
  failed: number;
  coveragePct: number;
  warnings: string[];
}

export interface BenchmarkDataset {
  id: string;
  name: string;
  targetMetrics: Record<string, number>;
}

export interface OutputContract {
  tests: number;
  passed: number;
  failed: number;
  coverage: string;
  status: string;
}

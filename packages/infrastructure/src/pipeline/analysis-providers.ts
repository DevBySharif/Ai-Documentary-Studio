/**
 * Extensible analysis provider contracts.
 * New AI models or third-party services implement these interfaces
 * without touching the pipeline core.
 */

// ─── Speech Analysis ────────────────────────────────────────────────────────

export interface TranscriptionSegment {
  readonly startTimeSeconds: number;
  readonly endTimeSeconds: number;
  readonly text: string;
  readonly speaker?: string;
  readonly confidence: number;
}

export interface SpeechAnalysisResult {
  readonly assetId: string;
  readonly language: string;
  readonly segments: ReadonlyArray<TranscriptionSegment>;
  readonly modelVersion: string;
}

export interface SpeechAnalysisProvider {
  analyze(assetId: string, audioPath: string): Promise<SpeechAnalysisResult>;
  supports(mimeType: string): boolean;
}

// ─── OCR ────────────────────────────────────────────────────────────────────

export interface OcrRegion {
  readonly text: string;
  readonly confidence: number;
  readonly boundingBox: { x: number; y: number; width: number; height: number };
}

export interface OcrResult {
  readonly assetId: string;
  readonly pageOrFrame: number;
  readonly regions: ReadonlyArray<OcrRegion>;
  readonly fullText: string;
}

export interface OcrProvider {
  analyze(assetId: string, imagePath: string): Promise<OcrResult>;
  supports(mimeType: string): boolean;
}

// ─── Visual Analysis ─────────────────────────────────────────────────────────

export interface VisualEntity {
  readonly type: "face" | "object" | "logo" | "landmark" | "text_region";
  readonly label: string;
  readonly confidence: number;
  readonly boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface VisualAnalysisResult {
  readonly assetId: string;
  readonly frameTimestampSeconds?: number;
  readonly entities: ReadonlyArray<VisualEntity>;
  readonly dominantColors: ReadonlyArray<string>;
  readonly motionIntensity?: number;
}

export interface VisualAnalysisProvider {
  analyze(assetId: string, imagePath: string): Promise<VisualAnalysisResult>;
  supports(mimeType: string): boolean;
}

// ─── Embedding / AI Preprocessing ────────────────────────────────────────────

export interface EmbeddingResult {
  readonly assetId: string;
  readonly vector: ReadonlyArray<number>;
  readonly modelVersion: string;
}

export interface EmbeddingProvider {
  embed(assetId: string, text: string): Promise<EmbeddingResult>;
}

// ─── Null Implementations (safe defaults) ────────────────────────────────────

export class NullSpeechAnalysisProvider implements SpeechAnalysisProvider {
  public async analyze(assetId: string, _audioPath: string): Promise<SpeechAnalysisResult> {
    return { assetId, language: "unknown", segments: [], modelVersion: "null" };
  }
  public supports(_mimeType: string): boolean { return false; }
}

export class NullOcrProvider implements OcrProvider {
  public async analyze(assetId: string, _imagePath: string): Promise<OcrResult> {
    return { assetId, pageOrFrame: 0, regions: [], fullText: "" };
  }
  public supports(_mimeType: string): boolean { return false; }
}

export class NullVisualAnalysisProvider implements VisualAnalysisProvider {
  public async analyze(assetId: string, _imagePath: string): Promise<VisualAnalysisResult> {
    return { assetId, entities: [], dominantColors: [] };
  }
  public supports(_mimeType: string): boolean { return false; }
}

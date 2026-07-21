import { ImportJob } from "./import-job";
import { MediaAnalyzer, MediaAnalysisOutput } from "./media-analyzer";
import { ProxyGenerator, ProxyGenerationOutput } from "./proxy-generator";
import { WaveformGenerator, WaveformGenerationOutput } from "./waveform-generator";
import { SceneDetector, SceneDetectionOutput } from "./scene-detector";
import {
  SpeechAnalysisProvider,
  OcrProvider,
  VisualAnalysisProvider,
  SpeechAnalysisResult,
  OcrResult,
  VisualAnalysisResult,
} from "./analysis-providers";
import { PipelineStageResult } from "./stage";

export interface AssetPipelineConfig {
  outputDir: string;
  proxyQuality: "low" | "medium" | "high";
  enableSceneDetection: boolean;
  enableSpeechAnalysis: boolean;
  enableOcr: boolean;
  enableVisualAnalysis: boolean;
}

export interface AssetPipelineReport {
  jobId: string;
  assetId: string;
  stages: ReadonlyArray<PipelineStageResult<unknown>>;
  completedAt: Date;
  totalDurationMs: number;
}

/**
 * The top-level pipeline orchestrator.
 * Coordinates all independent, retryable stages:
 *   Analyze → Proxy → Waveform → Scene Detection → AI Analysis
 */
export class AssetPipeline {
  constructor(
    private readonly config: AssetPipelineConfig,
    private readonly analyzer: MediaAnalyzer,
    private readonly proxyGenerator: ProxyGenerator,
    private readonly waveformGenerator: WaveformGenerator,
    private readonly sceneDetector: SceneDetector,
    private readonly speechProvider: SpeechAnalysisProvider,
    private readonly ocrProvider: OcrProvider,
    private readonly visualProvider: VisualAnalysisProvider
  ) {}

  /**
   * Runs the full pipeline for a given import job.
   * Persists a checkpoint after each major stage.
   */
  public async process(job: ImportJob): Promise<AssetPipelineReport> {
    const pipelineStart = Date.now();
    const stages: Array<PipelineStageResult<unknown>> = [];
    const assetId = job.assetId ?? job.id;

    job.status = "Analyzing";
    job.checkpoint = { lastCompletedStage: "", savedAt: new Date() };

    // ── Stage 1: Media Analysis ──────────────────────────────────────────────
    const analysisResult = await this.analyzer.execute({
      assetId,
      filePath: job.sourcePath,
    });
    stages.push(analysisResult);
    job.checkpoint = { lastCompletedStage: "MediaAnalysis", savedAt: new Date() };

    const metadata = (analysisResult.output as MediaAnalysisOutput | undefined)?.metadata;

    job.status = "Processing";

    // ── Stage 2: Proxy Generation ────────────────────────────────────────────
    if (metadata?.durationSeconds !== undefined) {
      const proxyResult = await this.proxyGenerator.execute({
        assetId,
        sourcePath: job.sourcePath,
        outputDir: this.config.outputDir,
        quality: this.config.proxyQuality,
      });
      stages.push(proxyResult);
      job.checkpoint = { lastCompletedStage: "ProxyGeneration", savedAt: new Date() };
    }

    // ── Stage 3: Waveform Generation ─────────────────────────────────────────
    if (metadata?.audioStreams && metadata.audioStreams.length > 0) {
      const waveformResult = await this.waveformGenerator.execute({
        assetId,
        sourcePath: job.sourcePath,
        outputDir: this.config.outputDir,
      });
      stages.push(waveformResult);
      job.checkpoint = { lastCompletedStage: "WaveformGeneration", savedAt: new Date() };
    }

    // ── Stage 4: Scene Detection ─────────────────────────────────────────────
    if (this.config.enableSceneDetection && metadata?.durationSeconds !== undefined) {
      const sceneResult = await this.sceneDetector.execute({
        assetId,
        filePath: job.sourcePath,
      });
      stages.push(sceneResult);
      job.checkpoint = { lastCompletedStage: "SceneDetection", savedAt: new Date() };
    }

    // ── Stage 5: AI Analysis (optional providers) ─────────────────────────────
    if (this.config.enableSpeechAnalysis && this.speechProvider.supports(metadata?.mimeType ?? "")) {
      await this.speechProvider.analyze(assetId, job.sourcePath);
      job.checkpoint = { lastCompletedStage: "SpeechAnalysis", savedAt: new Date() };
    }

    if (this.config.enableOcr && this.ocrProvider.supports(metadata?.mimeType ?? "")) {
      await this.ocrProvider.analyze(assetId, job.sourcePath);
      job.checkpoint = { lastCompletedStage: "OcrAnalysis", savedAt: new Date() };
    }

    if (this.config.enableVisualAnalysis && this.visualProvider.supports(metadata?.mimeType ?? "")) {
      await this.visualProvider.analyze(assetId, job.sourcePath);
      job.checkpoint = { lastCompletedStage: "VisualAnalysis", savedAt: new Date() };
    }

    job.status = "Completed";
    job.completedAt = new Date();

    return {
      jobId: job.id,
      assetId,
      stages,
      completedAt: job.completedAt,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }
}

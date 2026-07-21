import { PipelineStage, PipelineStageResult, stageSuccess, stageFailure } from "./stage";
import { FfmpegAdapter, MediaMetadata } from "./ffmpeg-adapter";

export interface MediaAnalysisInput {
  assetId: string;
  filePath: string;
}

export interface MediaAnalysisOutput {
  assetId: string;
  metadata: MediaMetadata;
}

/**
 * Stage 1: Analyzes raw media to extract technical metadata.
 * Runs FFmpeg probe and caches the results.
 */
export class MediaAnalyzer implements PipelineStage<MediaAnalysisInput, MediaAnalysisOutput> {
  public readonly stageName = "MediaAnalysis";

  constructor(private readonly ffmpeg: FfmpegAdapter) {}

  public async execute(
    input: MediaAnalysisInput
  ): Promise<PipelineStageResult<MediaAnalysisOutput>> {
    const start = Date.now();
    try {
      const metadata = await this.ffmpeg.probe(input.filePath);
      return stageSuccess(
        this.stageName,
        { assetId: input.assetId, metadata },
        Date.now() - start
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return stageFailure(this.stageName, msg, Date.now() - start);
    }
  }
}

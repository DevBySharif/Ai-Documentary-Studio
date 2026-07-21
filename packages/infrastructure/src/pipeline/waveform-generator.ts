import { PipelineStage, PipelineStageResult, stageSuccess, stageFailure } from "./stage";
import { FfmpegAdapter, WaveformData } from "./ffmpeg-adapter";

const DEFAULT_WAVEFORM_RESOLUTION = 1000; // samples per second

export interface WaveformGenerationInput {
  assetId: string;
  sourcePath: string;
  outputDir: string;
  resolution?: number;
}

export interface WaveformGenerationOutput {
  assetId: string;
  waveformPath: string;
  data: WaveformData;
}

/**
 * Stage 3: Extracts audio waveform data for timeline visualization.
 * Optimized for rendering performance rather than playback accuracy.
 */
export class WaveformGenerator
  implements PipelineStage<WaveformGenerationInput, WaveformGenerationOutput>
{
  public readonly stageName = "WaveformGeneration";

  constructor(private readonly ffmpeg: FfmpegAdapter) {}

  public async execute(
    input: WaveformGenerationInput
  ): Promise<PipelineStageResult<WaveformGenerationOutput>> {
    const start = Date.now();
    const waveformPath = `${input.outputDir}/${input.assetId}-waveform.json`;
    const resolution = input.resolution ?? DEFAULT_WAVEFORM_RESOLUTION;

    try {
      const data = await this.ffmpeg.extractWaveform(
        input.sourcePath,
        waveformPath,
        resolution
      );

      return stageSuccess(
        this.stageName,
        { assetId: input.assetId, waveformPath, data },
        Date.now() - start
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return stageFailure(this.stageName, msg, Date.now() - start);
    }
  }
}

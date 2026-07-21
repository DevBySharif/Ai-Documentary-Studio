import { PipelineStage, PipelineStageResult, stageSuccess, stageFailure } from "./stage";
import { FfmpegAdapter, ProxyQuality } from "./ffmpeg-adapter";

export interface ProxyGenerationInput {
  assetId: string;
  sourcePath: string;
  outputDir: string;
  quality: ProxyQuality;
}

export interface ProxyGenerationOutput {
  assetId: string;
  proxyPath: string;
  quality: ProxyQuality;
}

/**
 * Stage 2: Generates proxy (low-fidelity) copies for editing performance.
 * Original media is never modified.
 */
export class ProxyGenerator
  implements PipelineStage<ProxyGenerationInput, ProxyGenerationOutput>
{
  public readonly stageName = "ProxyGeneration";

  constructor(private readonly ffmpeg: FfmpegAdapter) {}

  public async execute(
    input: ProxyGenerationInput
  ): Promise<PipelineStageResult<ProxyGenerationOutput>> {
    const start = Date.now();
    const proxyPath = `${input.outputDir}/${input.assetId}-proxy-${input.quality}.mp4`;

    try {
      await this.ffmpeg.generateProxy(input.sourcePath, proxyPath, input.quality);
      return stageSuccess(
        this.stageName,
        { assetId: input.assetId, proxyPath, quality: input.quality },
        Date.now() - start
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return stageFailure(this.stageName, msg, Date.now() - start);
    }
  }
}

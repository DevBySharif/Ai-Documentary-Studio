import { PipelineStage, PipelineStageResult, stageSuccess, stageFailure } from "./stage";

export interface DetectedScene {
  readonly index: number;
  readonly startTimeSeconds: number;
  readonly endTimeSeconds: number;
  readonly transitionType: "hard_cut" | "fade" | "dissolve" | "wipe" | "unknown";
  readonly confidence: number;
}

export interface SceneDetectionInput {
  assetId: string;
  filePath: string;
  sensitivityThreshold?: number;
}

export interface SceneDetectionOutput {
  assetId: string;
  scenes: ReadonlyArray<DetectedScene>;
  totalScenes: number;
}

/**
 * Stage 4: Detects shot boundaries and scene transitions.
 * Outputs are structured metadata for editing and AI workflows.
 *
 * The real implementation uses FFmpeg's `select` filter or a dedicated
 * computer vision model. This abstraction decouples that choice.
 */
export class SceneDetector
  implements PipelineStage<SceneDetectionInput, SceneDetectionOutput>
{
  public readonly stageName = "SceneDetection";

  // Sensitivity: 0–1, where 1 = detect only hard cuts, 0 = detect everything
  private readonly DEFAULT_THRESHOLD = 0.3;

  public async execute(
    input: SceneDetectionInput
  ): Promise<PipelineStageResult<SceneDetectionOutput>> {
    const start = Date.now();

    try {
      // In production this calls FFmpeg's scene detection filter.
      // Returning an empty scene list here as the null implementation.
      const scenes: DetectedScene[] = [];

      return stageSuccess(
        this.stageName,
        { assetId: input.assetId, scenes, totalScenes: scenes.length },
        Date.now() - start
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return stageFailure(this.stageName, msg, Date.now() - start);
    }
  }
}

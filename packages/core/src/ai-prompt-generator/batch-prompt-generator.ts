import { TargetImageModel, PromptComponents, CompiledPrompt } from "./prompt-types";
import { ModelOptimizer } from "./model-optimizer";
import { ConsistencyManager } from "./consistency-manager";

export interface BatchPromptRequest {
  readonly scope: "EntireDocumentary" | "Chapter" | "Scene" | "Shot";
  readonly targetModel: TargetImageModel;
  readonly componentList: ReadonlyArray<PromptComponents>;
}

/**
 * Batch Prompt Generator (Vol 04 Part 06 - Section 16).
 * Generates prompts for entire chapters, scenes, or documentary projects concurrently.
 */
export class BatchPromptGenerator {
  constructor(
    private readonly optimizer: ModelOptimizer,
    private readonly consistency: ConsistencyManager
  ) {}

  public generateBatch(request: BatchPromptRequest): ReadonlyArray<CompiledPrompt> {
    return request.componentList.map((comp) => {
      const consistent = this.consistency.applyConsistency(comp);
      return this.optimizer.compilePrompt(consistent, request.targetModel);
    });
  }
}

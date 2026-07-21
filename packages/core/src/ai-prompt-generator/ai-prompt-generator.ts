import { TargetImageModel, VisualStyle, PromptComponents, CompiledPrompt } from "./prompt-types";
import { ModelOptimizer } from "./model-optimizer";
import { ConsistencyManager } from "./consistency-manager";
import { PromptQualityScorer, PromptQualityReport } from "./prompt-quality-scorer";
import { PromptVersionManager } from "./prompt-versioning";
import { BatchPromptGenerator } from "./batch-prompt-generator";

/**
 * Master AI Prompt Generator Engine (Main Vol 04 Part 06).
 * Drives workflow: Storyboard -> Scene Analysis -> Visual Intent -> Prompt Planning -> Model Optimization -> Prompt Validation -> Generation Ready.
 */
export class AiPromptGenerator {
  public readonly optimizer = new ModelOptimizer();
  public readonly consistency = new ConsistencyManager();
  public readonly scorer = new PromptQualityScorer();
  public readonly versionManager = new PromptVersionManager();
  public readonly batchGenerator: BatchPromptGenerator;

  constructor() {
    this.batchGenerator = new BatchPromptGenerator(this.optimizer, this.consistency);
  }

  public async generatePromptFromStoryboardShot(
    subject: string,
    environment: string,
    timePeriod: string,
    cameraAngle: string,
    targetModel: TargetImageModel = "FLUX",
    visualStyle: VisualStyle = "CinematicRealism"
  ): Promise<{ prompt: CompiledPrompt; qualityReport: PromptQualityReport }> {
    const rawComponents: PromptComponents = {
      subject,
      action: "standing in contemplative pose",
      environment,
      timePeriod,
      mood: "Dramatic and Historical",
      composition: "Rule of Thirds",
      cameraAngle,
      lens: "85mm prime lens",
      lighting: "Soft volumetric golden hour backlight",
      colorPalette: "Rich muted earth tones",
      visualStyle,
      historicalConstraints: [`Must accurately reflect ${timePeriod} architecture and attire.`],
      technicalInstructions: "High resolution documentary visual",
    };

    // 1. Enforce Style & Character Consistency
    const components = this.consistency.applyConsistency(rawComponents);

    // 2. Model-Aware Optimization
    const prompt = this.optimizer.compilePrompt(components, targetModel);

    // 3. Save Version & Score Quality
    this.versionManager.saveVersion(prompt);
    const qualityReport = this.scorer.scorePrompt(prompt, components);

    return { prompt, qualityReport };
  }
}

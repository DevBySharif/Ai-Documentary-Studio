import { AiCapabilityCategory, ModelCategoryType, AiExecutionMode } from "./ai-platform-types";

export interface ReasoningPlan {
  readonly capability: AiCapabilityCategory;
  readonly recommendedModelCategory: ModelCategoryType;
  readonly executionMode: AiExecutionMode;
  readonly requiresMultiModelCollaboration: boolean;
  readonly rationale: string;
}

/**
 * High-Level AI Reasoning Engine (Vol 07 Part 01 - Section 5, Section 9).
 * Evaluates requested capabilities and formulates execution mode plans before physical provider invocation.
 */
export class AiReasoningEngine {
  public formulateReasoningPlan(capability: AiCapabilityCategory, contextComplexityScore = 5): ReasoningPlan {
    let mode: AiExecutionMode = "SingleModel";
    let isMulti = false;
    let modelCat: ModelCategoryType = "GeneralLanguage";

    switch (capability) {
      case "Research":
        modelCat = "ResearchModel";
        if (contextComplexityScore > 7) {
          mode = "MultiModelCollaboration";
          isMulti = true;
        }
        break;
      case "ImageGeneration":
        modelCat = "ImageGenerationModel";
        break;
      case "VoiceSynthesis":
        modelCat = "VoiceSynthesisModel";
        break;
      case "FactChecking":
        modelCat = "ResearchModel";
        mode = "Sequential";
        break;
      default:
        modelCat = "GeneralLanguage";
    }

    return {
      capability,
      recommendedModelCategory: modelCat,
      executionMode: mode,
      requiresMultiModelCollaboration: isMulti,
      rationale: `Formulated ${mode} execution plan for ${capability} with category ${modelCat}.`,
    };
  }
}

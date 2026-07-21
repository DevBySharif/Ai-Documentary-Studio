import { ProjectLifecycleStage, StageConditionDescriptor } from "./workflow-types";

/**
 * Entry/Exit Condition & Upstream Dependency Evaluator (Vol 06 Part 05 - Section 6, Section 7, Section 8, Section 9).
 * Evaluates whether entry and exit requirements are met for each stage based on completed upstream dependencies.
 */
export class StageDependencyConditionEvaluator {
  public evaluateStageConditions(
    stage: ProjectLifecycleStage,
    completedStages: ReadonlyArray<ProjectLifecycleStage>
  ): StageConditionDescriptor {
    const upstreamMap: Record<ProjectLifecycleStage, ProjectLifecycleStage[]> = {
      Created: [],
      Research: ["Created"],
      Script: ["Research"],
      Storyboard: ["Script"],
      PromptPreparation: ["Storyboard"],
      ImageProduction: ["PromptPreparation"],
      VoiceProduction: ["Script"],
      TimelineEditing: ["ImageProduction", "VoiceProduction"],
      Review: ["TimelineEditing"],
      Export: ["Review"],
      Archived: ["Export"],
    };

    const required = upstreamMap[stage] || [];
    const entryMet = required.every((req) => completedStages.includes(req));

    return {
      stage,
      requiredUpstreamStages: required,
      entryRequirementsMet: entryMet,
      exitRequirementsMet: completedStages.includes(stage),
    };
  }
}

export type AutonomousMode =
  | "AssistedMode"
  | "GuidedMode"
  | "SemiAutonomousMode"
  | "AutonomousMode";

export type ProductionPhase =
  | "TopicDefinition"
  | "ProductionPlanning"
  | "Research"
  | "Writing"
  | "Storyboard"
  | "AssetGeneration"
  | "Narration"
  | "TimelineComposition"
  | "Review"
  | "Approval"
  | "FinalProduction";

export type SpecializedAgentRole =
  | "ResearchAgent"
  | "WritingAgent"
  | "StoryboardAgent"
  | "PromptAgent"
  | "ImageAgent"
  | "VoiceAgent"
  | "TimelineAgent"
  | "ReviewAgent"
  | "QualityAgent";

export type QualityGateStatus = "Passed" | "Degraded" | "Failed" | "Bypassed";

export interface DirectorTask {
  readonly taskId: string;
  readonly phase: ProductionPhase;
  readonly assignedAgent: SpecializedAgentRole;
  readonly taskDescription: string;
  readonly isCompleted: boolean;
}

export interface ProductionPlan {
  readonly planId: string;
  readonly topic: string;
  readonly mode: AutonomousMode;
  readonly currentPhase: ProductionPhase;
  readonly tasks: ReadonlyArray<DirectorTask>;
  readonly estimatedDurationMins: number;
}

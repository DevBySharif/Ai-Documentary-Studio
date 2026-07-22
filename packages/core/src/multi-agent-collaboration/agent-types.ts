export type SpecializedAgentRole =
  | "ResearchAgent"
  | "OutlineAgent"
  | "ScriptAgent"
  | "FactVerificationAgent"
  | "PromptEngineeringAgent"
  | "StoryboardAgent"
  | "ImageDirectionAgent"
  | "NarrationAgent"
  | "TranslationAgent"
  | "ReviewAgent";

export type CollaborationPatternType =
  | "Sequential"
  | "Parallel"
  | "Hierarchical"
  | "ReviewLoop";

export interface AgentDescriptor {
  readonly agentId: string;
  readonly role: SpecializedAgentRole;
  readonly capabilities: ReadonlyArray<string>;
  readonly preferredModels: ReadonlyArray<string>;
  readonly version: string;
  readonly status: "Active" | "Busy" | "Offline" | "Failed";
}

export interface AgentCommunicationArtifact {
  readonly artifactId: string;
  readonly senderAgentId: string;
  readonly recipientAgentId: string;
  readonly artifactType: string; // e.g. "ResearchSummary", "ScriptDraft", "ReviewComments"
  readonly payloadJson: string;
  readonly timestamp: Date;
}

export interface AgentConflictRecord {
  readonly conflictId: string;
  readonly claimingAgentIds: ReadonlyArray<string>;
  readonly topic: string;
  readonly conflictDetails: string;
  readonly resolutionStrategy: "ConfidenceComparison" | "TrustedSourcePreference" | "HumanReview";
  readonly resolvedValue: string;
  readonly timestamp: Date;
}

export interface AgentPerformanceMetrics {
  readonly agentId: string;
  readonly totalTasksCompleted: number;
  readonly successRatePercent: number;
  readonly averageQualityScore: number;
  readonly totalTokensConsumed: number;
  readonly humanCorrectionFrequency: number;
}

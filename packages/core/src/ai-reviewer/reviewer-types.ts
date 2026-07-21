export type IssueSeverity = "Critical" | "High" | "Medium" | "Low" | "Informational";

export type ReviewDomain =
  | "FactCheck"
  | "Citation"
  | "Hallucination"
  | "TimelineConsistency"
  | "EntityContinuity"
  | "VisualQuality"
  | "AudioQuality"
  | "ScriptQuality"
  | "CopyrightLicensing";

export interface ValidationIssue {
  readonly issueId: string;
  readonly domain: ReviewDomain;
  readonly severity: IssueSeverity;
  readonly title: string;
  readonly description: string;
  readonly affectedComponent: string;
  readonly suggestedFix?: string;
  readonly isIgnoredByUser: boolean;
}

export interface QualityScoreBreakdown {
  readonly researchQualityScore: number; // 0 to 100
  readonly factualAccuracyScore: number;
  readonly storytellingScore: number;
  readonly visualQualityScore: number;
  readonly narrationScore: number;
  readonly editingScore: number;
  readonly technicalReadinessScore: number;
  readonly overallProductionScore: number;
}

export interface PublishReadinessReport {
  readonly reportId: string;
  readonly isReadyForPublishing: boolean;
  readonly qualityScores: QualityScoreBreakdown;
  readonly passedValidationsCount: number;
  readonly outstandingIssues: ReadonlyArray<ValidationIssue>;
  readonly riskSummary: string;
  readonly generatedAt: Date;
}

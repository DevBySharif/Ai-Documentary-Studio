export type QuickActionId =
  | "NewProject"
  | "OpenProject"
  | "ContinueLastProject"
  | "ImportProject"
  | "CloneProject"
  | "BrowseTemplates"
  | "AiQuickStart";

export type ProjectTemplateType =
  | "HistoricalDocumentary"
  | "Biography"
  | "ScienceDocumentary"
  | "InvestigativeSeries"
  | "EducationalLesson"
  | "GeographyDocumentary"
  | "YouTubeDocumentary"
  | "ShortDocumentary";

export type NotificationCategory =
  | "Information"
  | "Recommendation"
  | "Warning"
  | "Error"
  | "ReviewRequest";

export interface ProjectCardSummary {
  readonly projectId: string;
  readonly title: string;
  readonly thumbnailUrl: string;
  readonly lastOpenedAt: Date;
  readonly currentPhase: string;
  readonly completionPercent: number;
  readonly isPinned: boolean;
}

export interface AiActivityTask {
  readonly taskId: string;
  readonly title: string;
  readonly module: string;
  readonly progressPercent: number;
  readonly status: "Running" | "Completed" | "Failed" | "Queued";
  readonly estimatedTimeRemainingSecs: number;
}

export interface ProductionStatistics {
  readonly activeProjectsCount: number;
  readonly completedDocumentariesCount: number;
  readonly totalRenderTimeHours: number;
  readonly totalAiGenerationsCount: number;
  readonly totalScriptWordCount: number;
}

export interface GlobalSearchResult {
  readonly resultId: string;
  readonly title: string;
  readonly category: "Project" | "Script" | "Storyboard" | "Asset" | "Prompt" | "Marker" | "Task";
  readonly targetModule: string;
  readonly snippet: string;
}

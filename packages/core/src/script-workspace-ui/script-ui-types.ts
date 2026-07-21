export type ScriptApprovalStage =
  | "Draft"
  | "AIReviewed"
  | "HumanReviewed"
  | "Approved"
  | "Locked";

export type SplitScreenTarget =
  | "Research"
  | "Storyboard"
  | "PDF"
  | "SourceWebsite"
  | "None";

export interface ScriptSceneItem {
  readonly sceneId: string;
  readonly sceneNumber: number;
  readonly title: string;
  readonly contentText: string;
  readonly wordCount: number;
  readonly estimatedDurationSecs: number;
  readonly approvalStage: ScriptApprovalStage;
  readonly linkedEvidenceIds: ReadonlyArray<string>;
}

export interface ScriptInlineSuggestion {
  readonly suggestionId: string;
  readonly sceneId: string;
  readonly targetParagraphIndex: number;
  readonly suggestionType: "Expand" | "Rewrite" | "ImproveTransition" | "Simplify" | "InsertCitation";
  readonly originalText: string;
  readonly proposedText: string;
  readonly rationale: string;
}

export interface ReadabilityMetrics {
  readonly readingEaseScore: number; // 0 to 100
  readonly sentenceCount: number;
  readonly averageWordsPerSentence: number;
  readonly passiveVoicePercentage: number;
  readonly toneCategory: "DocumentaryDramatic" | "Academic" | "Conversational";
}

export interface VoiceTimingEstimate {
  readonly sceneId: string;
  readonly wordCount: number;
  readonly targetWordsPerMinute: number; // e.g. 140 WPM
  readonly estimatedSecondsMin: number;
  readonly estimatedSecondsRecommended: number;
  readonly estimatedSecondsMax: number;
  readonly pauseLocationsCount: number;
}

export interface ScriptCommentAnnotation {
  readonly commentId: string;
  readonly sceneId: string;
  readonly authorName: string;
  readonly text: string;
  readonly createdAt: Date;
  readonly isResolved: boolean;
}

export type ScriptMode =
  | "Documentary"
  | "Educational"
  | "Historical"
  | "Investigative"
  | "Biography"
  | "Science"
  | "Mystery"
  | "NewsAnalysis";

export type HookStyle =
  | "SurprisingFact"
  | "Question"
  | "EmotionalStatement"
  | "HistoricalMystery"
  | "Statistic"
  | "DramaticContrast"
  | "UnfinishedStory";

export type RewriteTone =
  | "Simpler"
  | "MoreCinematic"
  | "MoreEmotional"
  | "MoreConcise"
  | "MoreDetailed"
  | "MoreNeutral"
  | "MoreDramatic"
  | "MoreAcademic";

export interface ScriptScene {
  readonly sceneIndex: number;
  readonly title: string;
  readonly sceneObjective: string;
  readonly narrationText: string;
  readonly visualIntent: string; // Implicit visual guidance
  readonly transitionNotes: string;
  readonly estimatedDurationSeconds: number;
}

export interface ScriptOutput {
  readonly scriptId: string;
  readonly title: string;
  readonly mode: ScriptMode;
  readonly hook: string;
  readonly hookStyle: HookStyle;
  readonly scenes: ReadonlyArray<ScriptScene>;
  readonly endingSummary: string;
  readonly creditSuggestions: ReadonlyArray<string>;
  readonly totalDurationSeconds: number;
}

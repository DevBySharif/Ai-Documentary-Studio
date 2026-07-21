export type DensityScore = "low" | "medium" | "high" | "very_high";
export type StoryArcPhase =
  | "hook" | "question" | "curiosity" | "investigation"
  | "explanation" | "evidence" | "reveal" | "summary" | "cta";

export type ScenePurpose =
  | "hook" | "context" | "explain" | "reveal" | "transition"
  | "reflect" | "summarize" | "cta" | "evidence";

export type WordCategory = "concept" | "emotion" | "object" | "action" | "symbol";

export type ImageAction =
  | "new_image" | "reuse" | "zoom_in" | "zoom_out" | "pan"
  | "word_visual" | "symbolic_insert" | "none";

export type RetentionRisk = "attention_drop" | "pace_slow" | "visual_static" | "info_overload";

export interface StoryArc {
  phases: StoryArcPhase[];
  description: string;
}

export interface CuriosityLoop {
  id: string;
  type: "open_loop" | "mini_question" | "delayed_answer" | "pattern_interrupt";
  question: string;
  answer?: string;
  openAtScene: number;
  expectedCloseAtScene: number;
  intensity: number;
}

export interface EmotionPoint {
  sceneIndex: number;
  emotion: string;
  intensity: number;
  duration: number;
}

export interface KnowledgeStep {
  sceneIndex: number;
  action: "known" | "introduce" | "explain" | "visualize" | "repeat" | "finalize";
  concept: string;
  complexity: DensityScore;
}

export interface SceneObjective {
  sceneId: number;
  purpose: ScenePurpose;
  goal: string;
  emotion: string;
  knowledge: string;
  importance: number;
  expectedDuration: number;
  visualGoal: string;
  retentionGoal: string;
  density: DensityScore;
  storyArcPhase: StoryArcPhase;
}

export interface RevealPlan {
  mainReveal: {
    content: string;
    sceneIndex: number;
    emotionalTarget: string;
  };
  supportingReveals: Array<{
    content: string;
    sceneIndex: number;
  }>;
  miniReveals: Array<{
    content: string;
    sceneIndex: number;
  }>;
  surpriseMoments: Array<{
    content: string;
    sceneIndex: number;
    intensity: number;
  }>;
  emotionalPeaks: number[];
}

export interface WordEmphasis {
  word: string;
  category: WordCategory;
  sceneIndex: number;
  sentenceIndex: number;
  importance: number;
  visualTemplate: string;
}

export interface VisualNarrativePlan {
  sceneIndex: number;
  visualType: string;
  description: string;
  imageAction: ImageAction;
  reuseReference?: string;
  metaphorRef?: string;
  wordEmphasis?: WordEmphasis;
}

export interface VisualSyncSentence {
  text: string;
  estimatedDuration: number;
  sceneIndex: number;
  sceneType: ScenePurpose;
  imageType: string;
  imageAction: ImageAction;
  motionSuggestion: string;
  transitionSuggestion: string;
  wordInsertTiming?: number;
  wordInsertText?: string;
}

export interface VisualSynchronizationPlan {
  sentences: VisualSyncSentence[];
  totalDuration: number;
}

export interface PacingProfile {
  averageSentenceLength: number;
  sceneDurations: number[];
  visualHoldTime: number;
  transitionFrequency: number;
  pauseFrequency: number;
  informationRhythm: "steady" | "accelerating" | "wave" | "varied";
}

export interface ViewerRetentionPlan {
  riskPoints: Array<{
    sceneIndex: number;
    risk: RetentionRisk;
    probability: number;
    recommendedAction: string;
  }>;
}

export interface NarrativeBlueprint {
  mainTopic: string;
  coreQuestion: string;
  coreMessage: string;
  learningGoal: string;
  targetAudience: string;
  runtime: number;
  sceneCount: number;
  storyStructure: string;
  finalReveal: string;
  ctaGoal: string;

  storyArc: StoryArc;
  curiosityLoops: CuriosityLoop[];
  emotionCurve: EmotionPoint[];
  knowledgeCurve: KnowledgeStep[];
  sceneObjectives: SceneObjective[];
  revealPlan: RevealPlan;
  pacingProfile: PacingProfile;
  visualNarrativePlan: VisualNarrativePlan[];
  wordEmphasisList: WordEmphasis[];
  viewerRetentionPlan: ViewerRetentionPlan;
  visualSyncPlan: VisualSynchronizationPlan;

  metadata: {
    id: string;
    projectId: string;
    version: string;
    createdAt: string;
    validated: boolean;
    validationScore: number;
  };
}

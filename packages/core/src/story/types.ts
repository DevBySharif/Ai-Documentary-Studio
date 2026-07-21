export type HookPattern =
  | "unexpected_fact"
  | "counter_intuitive"
  | "curiosity_question"
  | "mystery"
  | "strong_contrast"
  | "emotional_trigger";

export type TransitionType =
  | "cause_effect"
  | "question_answer"
  | "past_present"
  | "problem_solution"
  | "observation_insight"
  | "analogy_explanation";

export type EmotionTag =
  | "curiosity"
  | "surprise"
  | "calm"
  | "urgency"
  | "reflection"
  | "wonder"
  | "suspense"
  | "hope"
  | "mystery"
  | "awe"
  | "fear";

export type VisualIntent =
  | "new_scene"
  | "image_reuse"
  | "symbolic_visual"
  | "word_level_insert"
  | "diagram"
  | "close_up"
  | "wide_shot"
  | "motion_graphics";

export type FactType =
  | "verified_fact"
  | "interpretation"
  | "analogy"
  | "hypothesis"
  | "opinion";

export interface ConceptTag {
  term: string;
  importance: number;
  isPrimary: boolean;
}

export interface TaggedSentence {
  index: number;
  text: string;
  emotion: EmotionTag;
  visualIntent: VisualIntent;
  concepts: ConceptTag[];
  factType: FactType;
  estimatedDuration: number;
  wordCount: number;
  sceneIndex: number;
  transitionFromPrevious?: TransitionType;
  pauseAfter: boolean;
  emphasisWords: string[];
}

export interface ScriptScene {
  sceneNumber: number;
  purpose: string;
  narration: TaggedSentence[];
  emotion: EmotionTag;
  keyConcept: string;
  visualIntent: VisualIntent;
  estimatedDuration: number;
  importance: number;
  sceneTransition?: TransitionType;
}

export interface HookOutput {
  pattern: HookPattern;
  text: string;
  estimatedDuration: number;
}

export interface SemanticSegment {
  id: string;
  sceneIndex: number;
  startSentenceIndex: number;
  endSentenceIndex: number;
  visualConcept: string;
  visualIntent: VisualIntent;
  imageAction: string;
  motionSuggestion: string;
  transitionSuggestion: string;
  sentences: TaggedSentence[];
  totalDuration: number;
}

export interface StoryScript {
  scenes: ScriptScene[];
  hook: HookOutput;
  totalDuration: number;
  totalWordCount: number;
  semanticSegments: SemanticSegment[];
  metadata: {
    id: string;
    blueprintId: string;
    projectId: string;
    version: string;
    createdAt: string;
    validated: boolean;
    validationScore: number;
    totalScenes: number;
    runtime: number;
  };
}

export interface ScriptValidationReport {
  passed: boolean;
  score: number;
  checks: Array<{
    name: string;
    status: "pass" | "warn" | "fail";
    message: string;
    score: number;
    maxScore: number;
  }>;
}

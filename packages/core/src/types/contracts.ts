export interface ResearchNote {
  sources: Array<{
    url?: string;
    title: string;
    relevance: number;
    keyFindings: string[];
    verified: boolean;
  }>;
  keyConcepts: Array<{
    term: string;
    definition: string;
    simplified: string;
  }>;
  analogies: Array<{
    concept: string;
    analogy: string;
    everydayExample: string;
  }>;
}

export interface LegacyScriptScene {
  sceneNumber: number;
  purpose: string;
  emotion: string;
  narration: string;
  visualDescription: string;
  expectedDuration: number;
  openLoopsInserted: string[];
  visualIntention: {
    needMetaphor: boolean;
    needSymbolism: boolean;
    cameraFraming: string;
  };
}

export interface ScriptOutput {
  projectId: string;
  title: string;
  overview: string;
  scenes: LegacyScriptScene[];
  metadata: {
    totalDuration: number;
    totalScenes: number;
    averageSceneDuration: number;
  };
}

export interface SceneAnalysis {
  sceneId: number;
  purpose: string;
  emotion: string;
  visualPriority: number;
  needNewImage: boolean;
  reuseExistingImage: boolean;
  reuseReference?: string;
  needWordLevelVisual: boolean;
  suggestedCameraFraming: string;
  estimatedDuration: number;
}

export interface LegacyScenePrompt {
  sceneId: number;
  sceneNumber: number;
  prompt: string;
  negativePrompt: string;
  cameraSuggestion: string;
  motionSuggestion: string;
  reuseSuggestion: {
    reuse: boolean;
    reason: string;
  };
  durationSuggestion: number;
  qualityGate: {
    styleConsistency: number;
    characterConsistency: number;
    visualClarity: number;
    passed: boolean;
  };
}

export interface EditingPlan {
  sceneId: number;
  motionStyle: string;
  zoomRules: Record<string, unknown>;
  transitionType: string;
  transitionDuration: number;
  holdDuration: number;
  cameraMotion: string;
}

export interface TimelineTrack {
  id: string;
  type: "video" | "audio" | "text" | "effect";
  clips: Array<{
    id: string;
    start: number;
    duration: number;
    source: string;
    effects: Array<{
      type: string;
      config: Record<string, unknown>;
    }>;
  }>;
}

export interface TimelineOutput {
  projectId: string;
  tracks: TimelineTrack[];
  duration: number;
}

export interface QualityReport {
  passed: boolean;
  overallScore: number;
  checks: Array<{
    name: string;
    score: number;
    passed: boolean;
    message?: string;
  }>;
  warnings: string[];
  errors: string[];
}

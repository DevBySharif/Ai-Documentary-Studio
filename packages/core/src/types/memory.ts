export interface OpenLoop {
  question: string;
  openedAt: number;
  expectedCloseAt: number;
  type: "main_curiosity" | "mini_question" | "future_reference" | "pattern_interrupt";
  resolved: boolean;
}

export interface ProjectMemory {
  projectId: string;
  storyProgress: {
    currentState: string;
    completedScenes: number[];
    currentSceneIndex: number;
  };
  openQuestions: OpenLoop[];
  characters: Array<{
    name: string;
    traits: string[];
    firstAppearance: number;
  }>;
  visualIdentity: {
    activePalette: string[];
    activeStyle: string;
    usedMetaphors: Array<{ concept: string; visual: string }>;
  };
  sceneHistory: Array<{
    sceneId: number;
    purpose: string;
    emotion: string;
    generatedAt: string;
  }>;
  promptHistory: Array<{
    sceneId: number;
    prompt: string;
    negativePrompt?: string;
    generatedAt: string;
  }>;
  motionHistory: Array<{
    sceneId: number;
    motionType: string;
    parameters: Record<string, unknown>;
  }>;
  decisions: Array<{
    engine: string;
    action: string;
    timestamp: string;
    confidence: number;
  }>;
}

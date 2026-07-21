export interface DNAMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  version: string;
  parentId?: string;
  author?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  changeLog: string[];
}

export interface GeneralConfig {
  channelName: string;
  targetAudience: string;
  averageVideoLength: number;
  uploadFrequency: string;
  writingDifficulty: "conversational" | "moderate" | "academic";
  defaultRuntime: number;
}

export interface StoryDNA {
  storyFormula: string;
  hookFormula: string;
  ctaFormula: string;
  curiosityRules: {
    openLoopFrequency: number;
    openLoopTypes: string[];
    maxConcurrentOpenLoops: number;
  };
  revealRules: {
    timing: string;
    layering: string;
    finalRevealStyle: string;
  };
  openLoopRules: {
    maxOpenLoops: number;
    resolutionRequired: boolean;
    defaultResolutionTime: number;
  };
  pacingRules: {
    averageSentenceLength: number;
    averageSceneLength: number;
    minSceneDuration: number;
    maxSceneDuration: number;
    fastScenes: string[];
    slowScenes: string[];
  };
  emotionCurve: Array<{
    phase: string;
    duration: number;
    intensity: number;
  }>;
  paragraphStyle: string;
  informationDensity: number;
  questionStyle: string[];
  scientificStyle: {
    analogyFirst: boolean;
    simplifyBeforeDetail: boolean;
    maxJargonPerScene: number;
    jargonDefinitionRequired: boolean;
  };
}

export interface VisualDNA {
  artStyle: string;
  characterStyle: string;
  environmentStyle: string;
  backgroundStyle: string;
  objectStyle: string;
  cameraLanguage: {
    default: string;
    dramatic: string;
    intimate: string;
    scale: string;
  };
  composition: string;
  lighting: {
    default: string;
    dramatic: string;
    mood: string;
  };
  colorPalette: {
    primary: string[];
    accent: string[];
    background: string[];
    moodMapping: Record<string, string[]>;
  };
  outlineThickness: "thin" | "medium" | "thick" | "none";
  negativeSpace: "generous" | "balanced" | "minimal";
  perspective: "2d_flat" | "isometric" | "3d" | "orthographic";
  visualSymbolism: Record<string, string>;
}

export interface PromptDNA {
  characterLock: {
    enabled: boolean;
    mode: "global_consistent" | "per_scene" | "none";
    fallback: string;
  };
  styleLock: {
    enabled: boolean;
    mode: "strict" | "flexible";
    rules: string[];
  };
  cameraRules: string[];
  lightingRules: string[];
  compositionRules: string[];
  promptPrefix: string;
  promptSuffix: string;
  negativePrompt: string[];
  consistencyRules: {
    characterMode: string;
    environmentMode: string;
    styleMode: string;
  };
  imageReuseRules: {
    strategy: "prefer_reuse" | "prefer_new" | "balanced";
    reuseThreshold: string;
    motionOnReuse: string;
  };
  wordPromptRules: {
    enabled: boolean;
    maxPerVideo: number;
    style: string;
  };
  scenePromptRules: Record<string, string>;
}

export interface EditingDNA {
  cameraMotion: {
    default: string;
    emphasis: string;
    reflection: string;
    reveal: string;
  };
  zoomRules: {
    slowSpeed: number;
    fastSpeed: number;
    defaultDirection: string;
    emotionMapping: Record<string, { speed: number; direction: string }>;
  };
  panRules: {
    enabled: boolean;
    maxSpeed: number;
    defaultDirection: string;
  };
  pushRules: {
    intensity: number;
    timing: string;
  };
  pullRules: {
    speed: number;
    useFor: string[];
  };
  parallax: {
    enabled: boolean;
    depthLayers: number;
    speedRatio: number;
  };
  holdDuration: {
    minimum: number;
    maximum: number;
    complexImage: number;
    simpleImage: number;
  };
  transitionStyle: {
    default: string;
    sceneChange: string;
    emphasis: string;
    reflection: string;
    duration: number;
  };
  sceneRhythm: Record<string, string>;
  viewerRetentionStyle: string;
  emotionMapping: Record<string, {
    motion: string;
    transition: string;
    holdDuration: number;
  }>;
}

export interface ResearchDNA {
  preferredSources: string[];
  factChecking: {
    minSources: number;
    crossReference: boolean;
    dateRecency: string;
  };
  scientificAccuracy: "accessible" | "balanced" | "rigorous";
  analogyStyle: "everyday" | "technical" | "creative";
  simplificationRules: {
    maxTechnicalDepth: string;
    analogyFirst: boolean;
    jargonDefinitionRequired: boolean;
  };
  citationRules: {
    style: string;
    visible: boolean;
  };
  explanationStyle: "conversational" | "academic" | "narrative";
}

export interface AudioDNA {
  preferredVoice: {
    provider: string;
    voiceId: string;
    model?: string;
  };
  speechSpeed: number;
  speechEmotion: Record<string, {
    speed: number;
    pitch: number;
    style: string;
  }>;
  pauseRules: {
    afterHook: number;
    beforeReveal: number;
    afterReveal: number;
    emotionalPause: number;
    comma: number;
    period: number;
  };
  subtitleRules: {
    enabled: boolean;
    style: string;
    position: string;
    animation: string;
  };
  narrationStyle: "warm" | "authoritative" | "excited" | "calm";
}

export interface ThumbnailDNA {
  formula: string;
  color: {
    style: string;
    palette: string[];
    contrast: string;
  };
  composition: string;
  textPlacement: {
    position: string;
    maxWords: number;
    font: string;
    fontSize: string;
  };
  objectSize: "oversized" | "scaled" | "realistic";
  emotion: string[];
  clickTrigger: string;
}

export interface SEODNA {
  titleFormula: string;
  titleMaxLength: number;
  descriptionFormula: string;
  keywordFormula: {
    primary: string;
    secondary: string;
    longTail: boolean;
  };
  hashtags: {
    count: number;
    style: string;
  };
  playlistStrategy: string;
  tags: string[];
}

export interface QualityRules {
  thresholds: {
    characterConsistency: number;
    artStyleConsistency: number;
    promptQuality: number;
    storyFlow: number;
    timelineAccuracy: number;
  };
  onFailure: "regenerate" | "warn" | "block";
}

export interface VisualLibrary {
  characters: Array<{
    id: string;
    name: string;
    description: string;
    traits: string[];
    promptSeed: string;
  }>;
  objects: Array<{
    id: string;
    name: string;
    category: string;
    promptTemplate: string;
  }>;
  backgrounds: Array<{
    id: string;
    name: string;
    style: string;
    promptTemplate: string;
  }>;
  environments: Array<{
    id: string;
    name: string;
    description: string;
    promptTemplate: string;
  }>;
  symbols: Record<string, {
    visual: string;
    promptTemplate: string;
    usage: string;
  }>;
  cameras: Array<{
    name: string;
    angle: string;
    distance: string;
    lens: string;
  }>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
}

export interface PromptLibrary {
  templates: PromptTemplate[];
}

export interface MotionPreset {
  id: string;
  name: string;
  narrativeFunction: string;
  motionType: string;
  parameters: Record<string, unknown>;
  duration: number;
}

export interface MotionLibrary {
  presets: MotionPreset[];
}

export interface KnowledgeBase {
  domains: Array<{
    name: string;
    concepts: Array<{
      term: string;
      definition: string;
      simplified: string;
      relatedTerms: string[];
      visualMetaphor?: string;
    }>;
  }>;
}

export interface ChannelDNA {
  metadata: DNAMetadata;
  general: GeneralConfig;
  story: StoryDNA;
  visual: VisualDNA;
  prompt: PromptDNA;
  editing: EditingDNA;
  research: ResearchDNA;
  audio: AudioDNA;
  thumbnail: ThumbnailDNA;
  seo: SEODNA;
  quality: QualityRules;
  visualLibrary: VisualLibrary;
  promptLibrary: PromptLibrary;
  motionLibrary: MotionLibrary;
  knowledgeBase: KnowledgeBase;
}

export interface CompiledDNA {
  source: ChannelDNA;
  compiledAt: string;
  version: string;
  runtime: {
    storyConfig: Record<string, unknown>;
    promptConfig: Record<string, unknown>;
    editingConfig: Record<string, unknown>;
    visualConfig: Record<string, unknown>;
  };
  cache: {
    promptTemplates: PromptTemplate[];
    motionPresets: MotionPreset[];
    visualSymbols: Record<string, string>;
  };
  validation: {
    passed: boolean;
    score: number;
    warnings: string[];
    errors: string[];
  };
}

export type DNAExportFormat = "json" | "yaml" | "markdown";

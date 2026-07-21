export interface CrossProjectMemoryEntry {
  projectId: string;
  projectName: string;
  bestImageIds: string[];
  bestPromptIds: string[];
  bestMotionIds: string[];
  bestTimelineIds: string[];
  bestSymbolIds: string[];
  bestStoryFlow: string;
  qualityScore: number;
  completedAt: string;
}

export interface ProjectEmbedding {
  projectId: string;
  embedding: number[];
  themes: string[];
  concepts: string[];
  channelId: string;
}

export interface ProjectSimilarityResult {
  projectId: string;
  similarity: number;
  matchedThemes: string[];
}

export interface ProductionSuccessScore {
  projectId: string;
  visualQuality: number;
  promptQuality: number;
  styleConsistency: number;
  timelineQuality: number;
  motionQuality: number;
  reuseEfficiency: number;
  overall: number;
}

export interface StoryPattern {
  id: string;
  name: string;
  structure: string[];
  description: string;
  bestFor: string[];
  successRate: number;
}

export interface CrossProjectMotionMemEntry {
  id: string;
  projectId: string;
  cameraPaths: string[];
  motionRhythm: string;
  kenBurnsPatterns: string[];
  parallaxSettings: Record<string, unknown>;
  transitionTiming: Record<string, number>;
  successScore: number;
}

export interface CrossProjectTimelineMemEntry {
  id: string;
  projectId: string;
  sceneDurations: number[];
  averageHold: number;
  revealTiming: number[];
  pausePlacement: number[];
  wordInsertTiming: number[];
  successScore: number;
}

export interface ProductionKnowledgeGraphNode {
  id: string;
  type: "project" | "chapter" | "scene" | "concept" | "prompt" | "image" | "motion" | "timeline" | "quality";
  label: string;
  connections: string[];
  metadata: Record<string, unknown>;
}

export interface ProductionKnowledgeGraph {
  nodes: ProductionKnowledgeGraphNode[];
  edges: Array<{ from: string; to: string; type: string }>;
}

export interface ExperienceRanking {
  assetId: string;
  reuseFrequency: number;
  qualityScore: number;
  styleConsistency: number;
  timelineSuccess: number;
  promptReliability: number;
  overallRank: number;
}

export interface ProductionPlaybook {
  id: string;
  channelId: string;
  category: string;
  storyStructure: string[];
  promptStyle: string[];
  visualLanguage: string[];
  motionProfile: string[];
  timelineRhythm: string[];
  successRate: number;
}

export interface LearningResult {
  projectId: string;
  worked: string[];
  failed: string[];
  improvements: string[];
  storedAt: string;
}

export interface SmartRecommendation {
  recommendedAssets: string[];
  recommendedPrompts: string[];
  recommendedMotion: string[];
  recommendedTimelines: string[];
  recommendedStories: string[];
  recommendedSymbols: string[];
  similarProjects: string[];
  reuseScore: number;
}

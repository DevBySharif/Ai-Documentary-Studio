export type MemoryCategory =
  | "temporary" | "session" | "project" | "channel" | "knowledge" | "asset" | "analytics";

export type MemoryStore =
  | "project" | "scene" | "image" | "prompt" | "concept" | "symbol"
  | "character" | "camera" | "motion" | "audio" | "story" | "semantic";

export interface MemoryEntry {
  id: string;
  store: MemoryStore;
  category: MemoryCategory;
  tags: string[];
  priority: number;
  relationships: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  data: Record<string, unknown>;
}

export interface ProjectMemoryState {
  projectId: string;
  currentStage: string;
  currentScene: number;
  completedScenes: number[];
  currentRuntime: number;
  activeCharacter: string;
  activeSymbols: string[];
  activeColorMood: string;
  storyProgress: number;
}

export interface SceneMemoryEntry {
  sceneNumber: number;
  purpose: string;
  emotion: string;
  concept: string;
  visualGoal: string;
  duration: number;
  generatedImages: string[];
  generatedMotion: string[];
  completionStatus: "pending" | "completed" | "skipped";
}

export interface ImageMemoryEntry {
  imageId: string;
  prompt: string;
  negativePrompt: string;
  concept: string;
  character: string;
  background: string;
  lighting: string;
  camera: string;
  emotion: string;
  scene: number;
  reuseCount: number;
  lastUsedTime: string;
  imageHash: string;
  similarityScore: number;
  quality: number;
}

export interface PromptMemoryEntry {
  promptId: string;
  promptText: string;
  scene: number;
  concept: string;
  generationSuccess: boolean;
  imageQuality: number;
  reuseFrequency: number;
  promptScore: number;
}

export interface ConceptMemoryEntry {
  concept: string;
  preferredSymbol: string;
  imageIds: string[];
  promptIds: string[];
  lastUsed: string;
  useCount: number;
}

export interface SymbolMemoryEntry {
  concept: string;
  symbol: string;
  imageId: string;
  reuseRule: "always" | "prefer_reuse" | "new_each_time";
  lastUsed: string;
}

export interface CharacterMemoryEntry {
  characterId: string;
  lastPose: string;
  lastExpression: string;
  lastEmotion: string;
  lastLocation: string;
  previousAppearances: string[];
  scale: number;
  cameraAngle: string;
}

export interface CameraMemoryEntry {
  previousShot: string;
  previousZoom: string;
  previousMotion: string;
  previousFraming: string;
  lastUsedTimestamp: number;
  usageHistory: string[];
}

export interface MotionMemoryEntry {
  motionType: string;
  duration: number;
  intensity: string;
  lastUsedScene: number;
  useCount: number;
  lastUsedTimestamp: number;
}

export interface StoryMemoryEntry {
  openQuestions: string[];
  solvedQuestions: string[];
  currentStoryStage: string;
  upcomingReveals: string[];
  viewerKnowledgeLevel: string;
}

export interface SemanticMemoryEntry {
  meaningId: string;
  originalText: string;
  normalizedConcept: string;
  emotion: string;
  imageIds: string[];
  promptIds: string[];
  importance: number;
  lastUsed: string;
}

export interface MemoryQuery {
  request: string;
  concept?: string;
  emotion?: string;
  camera?: string;
  scene?: number;
  imageId?: string;
  promptId?: string;
  threshold?: number;
  limit?: number;
}

export interface MemoryResult {
  found: boolean;
  entries: MemoryEntry[];
  confidence: number;
  message?: string;
}

export interface ImageSimilarityScore {
  imageId: string;
  concept: number;
  composition: number;
  camera: number;
  emotion: number;
  overall: number;
}

export interface MemoryGraphNode {
  id: string;
  type: MemoryStore;
  label: string;
  connections: string[];
  data: Record<string, unknown>;
}

export interface MemoryGraph {
  nodes: MemoryGraphNode[];
  edges: Array<{ from: string; to: string; weight: number; label: string }>;
}

export interface ContinuityCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  details?: string;
}

export interface ContinuityReport {
  passed: boolean;
  score: number;
  checks: ContinuityCheck[];
  issues: string[];
}

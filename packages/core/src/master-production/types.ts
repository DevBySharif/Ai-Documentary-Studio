export type MPLayer = "presentation" | "application" | "ai" | "rendering" | "infrastructure";

export type MPAIComponent = "script_gpt" | "prompt_gpt" | "image_analyzer" | "audio_intelligence" | "production_director" | "qa_ai";

export type MPRenderingComponent = "scene_renderer" | "motion_renderer" | "effects_engine" | "subtitle_engine" | "audio_mixer" | "frame_scheduler" | "gpu_renderer";

export type MPProductionStage =
  | "script" | "prompt" | "image" | "timeline" | "render" | "qa" | "export";

export type MPCheckpointStage =
  | "script_approved" | "images_approved" | "voice_approved" | "timeline_built"
  | "render_complete" | "qa_passed";

export type MPProviderCategory = "llm" | "image_generator" | "tts" | "stt" | "renderer" | "storage";

export type MPSecurityLevel = "api_key" | "prompt_library" | "channel_dna" | "user_assets" | "project_files";

export interface MPDataContract {
  version: string;
  source: string;
  timestamp: number;
  validationStatus: "pending" | "valid" | "invalid";
  payload: Record<string, unknown>;
}

export interface MPEventMessage {
  type: string;
  source: string;
  target: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface MPCheckpoint {
  stage: MPCheckpointStage;
  timestamp: number;
  projectVersion: string;
  data: Record<string, unknown>;
}

export interface MPProvider {
  category: MPProviderCategory;
  name: string;
  enabled: boolean;
  capabilities: string[];
}

export interface MPChannelDNA {
  channelId: string;
  name: string;
  storyStructure: string;
  scriptStyle: string;
  promptStyle: string;
  artStyle: string;
  characterDesign: string;
  motionLanguage: string;
  subtitleLanguage: string;
  colorLanguage: string;
  qaRules: Record<string, unknown>;
  exportProfile: string;
}

export interface MPWorkspace {
  workspaceId: string;
  channels: MPChannelDNA[];
}

export interface MPKnowledgeGraphNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface MPKnowledgeGraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface MPAssetReuseEntry {
  fingerprint: string;
  assetType: string;
  assetId: string;
  reuseCount: number;
  lastUsed: number;
}

export interface MPAnalyticsMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface MPExpansionCapability {
  name: string;
  supported: boolean;
  planned: boolean;
}

export interface MPOutputContract {
  project: string;
  pipeline: string;
  qa: string;
  export: string;
  channelDna: string;
  status: string;
}

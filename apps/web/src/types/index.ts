export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  idea: string;
  channelDnaId: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "draft"
  | "researching"
  | "scripting"
  | "prompting"
  | "generating_images"
  | "uploading_images"
  | "voicing"
  | "timeline"
  | "motion"
  | "rendering"
  | "complete";

export interface ChannelDNA {
  id: string;
  name: string;
  description: string;
  category: string;
  config: {
    story: Record<string, unknown>;
    visual: Record<string, unknown>;
    prompt: Record<string, unknown>;
    editing: Record<string, unknown>;
    thumbnail: Record<string, unknown>;
    seo: Record<string, unknown>;
  };
}

export interface Script {
  id: string;
  projectId: string;
  title: string;
  scenes: Scene[];
  metadata: Record<string, unknown>;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  narration: string;
  visualDescription: string;
  prompt: string;
  duration: number;
}

export interface PromptPack {
  id: string;
  projectId: string;
  scenes: ScenePrompt[];
}

export interface ScenePrompt {
  sceneId: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: string;
  style: string;
}

export interface VoiceConfig {
  id: string;
  projectId: string;
  provider: string;
  voiceId: string;
  speed: number;
  pitch: number;
}

export interface Timeline {
  id: string;
  projectId: string;
  tracks: Track[];
  duration: number;
}

export interface Track {
  id: string;
  type: "video" | "audio" | "text" | "effect";
  clips: Clip[];
}

export interface Clip {
  id: string;
  start: number;
  duration: number;
  source: string;
  effects: Effect[];
}

export interface Effect {
  type: "zoom" | "pan" | "fade" | "ken_burns" | "transition";
  config: Record<string, unknown>;
}

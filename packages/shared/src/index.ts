export const PROJECT_STATUSES = [
  "draft",
  "researching",
  "scripting",
  "prompting",
  "generating_images",
  "uploading_images",
  "voicing",
  "timeline",
  "motion",
  "rendering",
  "complete",
] as const;

export * from './ipc/types.js';
export * from './ipc/channels.js';

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_TYPES = [
  "documentary",
  "psychology",
  "history",
  "finance",
  "business",
  "educational",
  "storytelling",
  "explainer",
  "motivation",
  "custom",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const VOICE_PROVIDERS = ["elevenlabs", "openai", "google"] as const;

export type VoiceProvider = (typeof VOICE_PROVIDERS)[number];

export const IMAGE_PROVIDERS = [
  "google_flow",
  "imagen",
  "midjourney",
  "openai",
  "runway",
  "stable_diffusion",
] as const;

export type ImageProvider = (typeof IMAGE_PROVIDERS)[number];

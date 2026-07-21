import { z } from 'zod';

export const IdentityProfileSchema = z.object({
  channelName: z.string(),
  creativePhilosophy: z.string(),
  targetAudience: z.string(),
  language: z.string(),
  primaryNiche: z.string(),
  secondaryNiche: z.string().optional(),
  tone: z.string(),
  confidenceLevel: z.string().optional(),
});

export const NarrativeProfileSchema = z.object({
  storyStructure: z.string(),
  introductionStyle: z.string(),
  hookStrategy: z.string(),
  factPresentation: z.string(),
  emotionalIntensity: z.string(),
  sceneTransitions: z.string(),
  endingFormat: z.string(),
});

export const VisualLanguageSchema = z.object({
  artDirection: z.string(),
  colorPhilosophy: z.string(),
  shotComposition: z.string(),
  cameraBehavior: z.string(),
  lightingStyle: z.string(),
  imageRealism: z.string(),
  graphicElements: z.array(z.string()).default([]),
});

export const MotionLanguageSchema = z.object({
  cameraMovement: z.string(),
  zoomBehavior: z.string(),
  panRules: z.string(),
  motionIntensity: z.string(),
  transitionTiming: z.string(),
  sceneRhythm: z.string(),
  animationPresets: z.array(z.string()).default([]),
});

export const VoiceProfileSchema = z.object({
  narrationStyle: z.string(),
  speakingSpeed: z.string(),
  formality: z.string(),
  emotion: z.string(),
  pauseStrategy: z.string(),
  pronunciationPreferences: z.array(z.string()).default([]),
  languageRules: z.string().optional(),
});

export const AIPoliciesSchema = z.object({
  preferredProviders: z.array(z.string()).default([]),
  preferredModels: z.array(z.string()).default([]),
  creativityLevel: z.number().min(0).max(1),
  temperatureRanges: z.record(z.string(), z.number()).optional(), // e.g., { "script": 0.7, "image": 1.0 }
  jsonEnforcement: z.boolean().default(true),
  retryPolicy: z.string().optional(),
  costPreference: z.string().optional(), // 'budget' | 'balanced' | 'premium'
});

export const QualityEngineSchema = z.object({
  minimumScriptQuality: z.string(),
  historicalAccuracyRequirements: z.string(),
  visualConsistency: z.string(),
  promptCompleteness: z.string(),
  subtitleQuality: z.string(),
  motionSmoothness: z.string(),
});

export const ExportProfileSchema = z.object({
  preferredResolution: z.string(), // e.g. "1920x1080"
  aspectRatio: z.string(),
  codec: z.string(),
  subtitleFormat: z.string(),
  thumbnailProfile: z.string(),
  compressionQuality: z.string(),
});

export const ChannelDNASchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  version: z.string(),
  schemaVersion: z.string().default("1.0"),
  
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    capabilities: z.array(z.string()).default([]), // DNA Capability Flags
    changelog: z.string().optional(),
  }),
  
  identity: IdentityProfileSchema,
  narrative: NarrativeProfileSchema,
  visuals: VisualLanguageSchema,
  motion: MotionLanguageSchema,
  voice: VoiceProfileSchema,
  ai: AIPoliciesSchema,
  quality: QualityEngineSchema,
  export: ExportProfileSchema,
});

export type IdentityProfile = z.infer<typeof IdentityProfileSchema>;
export type NarrativeProfile = z.infer<typeof NarrativeProfileSchema>;
export type VisualLanguage = z.infer<typeof VisualLanguageSchema>;
export type MotionLanguage = z.infer<typeof MotionLanguageSchema>;
export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;
export type AIPolicies = z.infer<typeof AIPoliciesSchema>;
export type QualityEngine = z.infer<typeof QualityEngineSchema>;
export type ExportProfile = z.infer<typeof ExportProfileSchema>;
export type ChannelDNA = z.infer<typeof ChannelDNASchema>;

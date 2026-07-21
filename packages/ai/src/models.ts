import { z } from 'zod';

export enum AIRequestType {
  ScriptGeneration = 'ScriptGeneration',
  PromptGeneration = 'PromptGeneration',
  ImagePromptOptimization = 'ImagePromptOptimization',
  SceneAnalysis = 'SceneAnalysis',
  QAEvaluation = 'QAEvaluation',
  MetadataExtraction = 'MetadataExtraction',
  Translation = 'Translation',
  Summarization = 'Summarization',
  StructuredJSON = 'StructuredJSON',
  Reasoning = 'Reasoning',
  Classification = 'Classification',
}

export enum AICapability {
  TextGeneration = 'TextGeneration',
  Vision = 'Vision',
  ImageGeneration = 'ImageGeneration',
  AudioGeneration = 'AudioGeneration',
  Embeddings = 'Embeddings',
  ToolCalling = 'ToolCalling',
  Streaming = 'Streaming',
  JSONMode = 'JSONMode',
}

export const AIRequestSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(AIRequestType),
  workspaceId: z.string().optional(),
  projectId: z.string().optional(),
  modelPreference: z.string().optional(),
  providerPreference: z.string().optional(),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().int().positive().optional(),
  timeoutMs: z.number().int().positive().optional().default(30000),
  retryPolicy: z.object({
    maxRetries: z.number().int().min(0).default(3),
    backoffMs: z.number().int().min(0).default(1000),
  }).optional(),
  cachePolicy: z.object({
    enabled: z.boolean().default(true),
    ttlMs: z.number().int().positive().optional(),
  }).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  
  // The actual payload
  systemPrompt: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })),
  requiredCapabilities: z.array(z.nativeEnum(AICapability)).default([AICapability.TextGeneration]),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

export const AIResponseSchema = z.object({
  requestId: z.string().uuid(),
  provider: z.string(),
  model: z.string(),
  text: z.string().optional(),
  json: z.any().optional(),
  usage: z.object({
    promptTokens: z.number().int().nonnegative(),
    completionTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
    estimatedCostUsd: z.number().nonnegative().optional(),
  }),
  finishReason: z.string(),
  safetyStatus: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

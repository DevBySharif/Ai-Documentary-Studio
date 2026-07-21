import { z } from 'zod';
import { AIRequestType, AICapability } from '@studio/ai';
import { ChannelDNA } from '@studio/dna';

export const PromptBlockSchema = z.object({
  id: z.string(),
  category: z.string(),
  content: z.string(),
  variables: z.array(z.string()).default([]),
});

export type PromptBlock = z.infer<typeof PromptBlockSchema>;

export const PromptTemplateSchema = z.object({
  id: z.string(),
  version: z.string(),
  name: z.string(),
  category: z.string(),
  supportedTasks: z.array(z.nativeEnum(AIRequestType)),
  blocks: z.array(z.string()), // References to PromptBlocks
  templateText: z.string(),    // The main body holding layout and {{variables}}
  variables: z.array(z.string()),
  defaultValues: z.record(z.string(), z.any()).optional(),
  constraints: z.array(z.string()).default([]),
  outputSchemaName: z.string().optional(),
  compatibleModels: z.array(z.string()).default([]), // Empty implies all models
  requiredCapabilities: z.array(z.nativeEnum(AICapability)).default([]),
});

export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;

export interface CompiledPrompt {
  templateId: string;
  templateVersion: string;
  dnaVersion: string;
  systemPrompt: string;
  userPrompt: string;
  modelPreference?: string;
  requiredCapabilities: AICapability[];
  estimatedTokens: number;
}

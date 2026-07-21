import { PromptCompiler } from './compiler';
import { PromptOptimizer, ModelFamily } from './optimizer';
import { PromptQualityAnalyzer } from './analyzer';
import { CompiledPrompt } from './models';
import { ChannelDNA } from '@studio/dna';
import { AIRequest, AIRequestSchema } from '@studio/ai';
import { randomUUID } from 'crypto';
import pino from 'pino';

const logger = pino({ name: 'prompt-engine' });

export class PromptEngine {
  constructor(private compiler: PromptCompiler) {}

  /**
   * Generates a ready-to-execute AIRequest payload.
   * Compiles the template, optimizes for the target model family, validates quality, and wraps into an AIRequest.
   */
  async buildRequest(
    templateId: string,
    templateVersion: string,
    dna: ChannelDNA,
    projectContext: Record<string, any>,
    runtimeParams: Record<string, any>,
    modelFamily: ModelFamily = 'default'
  ): Promise<{ request: AIRequest; compiled: CompiledPrompt }> {
    
    // 1. Compile Raw Strings
    const { systemPrompt, userPrompt } = this.compiler.compile(
      templateId,
      templateVersion,
      dna,
      projectContext,
      runtimeParams
    );

    // 2. Optimize for Model
    const optimized = PromptOptimizer.optimize(systemPrompt, userPrompt, modelFamily);

    // 3. Analyze Quality (Validation before network execution)
    const metrics = PromptQualityAnalyzer.analyze(optimized.systemPrompt, optimized.userPrompt);
    
    if (metrics.missingVariables.length > 0) {
      throw new Error(`Failed to compile prompt: Missing variables ${metrics.missingVariables.join(', ')}`);
    }

    const template = this.compiler['registry'].getTemplate(templateId, templateVersion);


    // 4. Wrap into AIRequest for Orchestrator
    const request = AIRequestSchema.parse({
      id: randomUUID(),
      type: template.supportedTasks[0], // simplified for now
      systemPrompt: optimized.systemPrompt,
      messages: [{ role: 'user', content: optimized.userPrompt }],
      requiredCapabilities: template.requiredCapabilities,
      metadata: {
        templateId,
        templateVersion,
        dnaId: dna.id,
      }
    });

    const compiled: CompiledPrompt = {
      templateId,
      templateVersion,
      dnaVersion: dna.id,
      systemPrompt: optimized.systemPrompt,
      userPrompt: optimized.userPrompt,
      requiredCapabilities: template.requiredCapabilities,
      estimatedTokens: metrics.estimatedTokens
    };

    logger.info({ requestId: request.id, templateId, estimatedTokens: metrics.estimatedTokens }, 'Successfully built AI request');

    return { request, compiled };
  }
}

import { PromptTemplate } from './models';
import { ChannelDNA } from '@studio/dna';
import { PromptRegistry } from './registry';
import { VariableResolver } from './resolver';
import { PromptDNACompiler } from './dna';

export class PromptCompiler {
  constructor(private registry: PromptRegistry) {}

  /**
   * Compiles a template into a raw string prompt, resolving all variables, blocks, and DNA constraints.
   */
  compile(
    templateId: string,
    version: string,
    dna: ChannelDNA,
    projectContext: Record<string, any>,
    runtimeParams: Record<string, any>
  ): { systemPrompt: string; userPrompt: string } {
    
    const template = this.registry.getTemplate(templateId, version);

    // 1. Resolve Variables
    const allTemplateVariables = new Set(template.variables);
    template.blocks.forEach(blockId => {
      this.registry.getBlock(blockId).variables.forEach(v => allTemplateVariables.add(v));
    });

    const resolvedVariables = VariableResolver.resolve(
      Array.from(allTemplateVariables),
      template.defaultValues,
      projectContext,
      runtimeParams
    );

    // 2. Resolve DNA
    const dnaString = PromptDNACompiler.compileToPromptContext(dna);

    // 3. Resolve Blocks
    const blockStrings = template.blocks.map(blockId => {
      const block = this.registry.getBlock(blockId);
      return this.interpolate(block.content, resolvedVariables);
    });

    // 4. Construct System Prompt (Rules, DNA, Constraints, Blocks)
    const systemComponents = [
      '### SYSTEM ROLE & INSTRUCTIONS',
      dnaString,
      ...blockStrings,
      template.constraints.length > 0 ? `### CONSTRAINTS\n- ${template.constraints.join('\n- ')}` : '',
    ];

    // 5. Construct User Prompt
    const userPrompt = this.interpolate(template.templateText, resolvedVariables);

    return {
      systemPrompt: systemComponents.filter(Boolean).join('\n\n'),
      userPrompt
    };
  }

  private interpolate(text: string, variables: Record<string, any>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    }
    return result;
  }
}

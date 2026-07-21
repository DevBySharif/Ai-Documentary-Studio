export type ModelFamily = 'gemini' | 'gpt' | 'claude' | 'default';

export class PromptOptimizer {
  /**
   * Adjusts compiled prompts based on target model quirks and optimization profiles.
   */
  static optimize(systemPrompt: string, userPrompt: string, family: ModelFamily = 'default'): { systemPrompt: string; userPrompt: string } {
    switch (family) {
      case 'gemini':
        // Gemini prefers strict markdown structures and explicit negative constraints in the user prompt
        return {
          systemPrompt: systemPrompt.trim(),
          userPrompt: `${userPrompt.trim()}\n\nCRITICAL: Ensure you follow the system instructions precisely.`
        };
      case 'claude':
        // Claude prefers XML tags for context boundaries
        return {
          systemPrompt: `<instructions>\n${systemPrompt.trim()}\n</instructions>`,
          userPrompt: userPrompt.trim()
        };
      case 'gpt':
        // GPT prefers role emphasis
        return {
          systemPrompt: `You are an expert documentary AI.\n\n${systemPrompt.trim()}`,
          userPrompt: userPrompt.trim()
        };
      default:
        return { systemPrompt, userPrompt };
    }
  }
}

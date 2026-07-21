import pino from 'pino';

const logger = pino({ name: 'prompt-analyzer' });

export interface PromptMetrics {
  estimatedTokens: number;
  variableCompleteness: number;
  missingVariables: string[];
  hasEmptySections: boolean;
  warnings: string[];
}

export class PromptQualityAnalyzer {
  static analyze(systemPrompt: string, userPrompt: string, schemaName?: string): PromptMetrics {
    const combined = systemPrompt + '\n' + userPrompt;
    const warnings: string[] = [];

    // Naive token estimation (4 chars ~= 1 token)
    const estimatedTokens = Math.ceil(combined.length / 4);

    if (estimatedTokens > 10000) {
      warnings.push(`High token usage estimated (${estimatedTokens} tokens). Model context truncation risk.`);
    }

    // Check for unresolved variables (e.g., {{ someVar }})
    const unresolvedMatches = combined.match(/{{[^}]+}}/g) || [];
    const missingVariables = Array.from(new Set(unresolvedMatches));

    if (missingVariables.length > 0) {
      warnings.push(`Found ${missingVariables.length} unresolved template variables: ${missingVariables.join(', ')}`);
    }

    if (schemaName && !combined.toLowerCase().includes('json')) {
      warnings.push(`Output schema '${schemaName}' specified, but JSON instructions might be missing from the prompt body.`);
    }

    if (warnings.length > 0) {
      logger.warn({ warnings }, 'Prompt Quality Analyzer flagged issues');
    }

    return {
      estimatedTokens,
      missingVariables,
      variableCompleteness: missingVariables.length === 0 ? 1 : 0,
      hasEmptySections: combined.includes('### \n') || combined.includes('### \r\n'),
      warnings
    };
  }
}

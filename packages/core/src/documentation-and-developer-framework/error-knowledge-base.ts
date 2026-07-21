import { ErrorDefinition } from './types';

export class ErrorKnowledgeBase {
  private errors: Map<string, ErrorDefinition> = new Map();

  constructor() {
    this.loadDefaultErrors();
  }

  getErrorResolution(errorCode: string): ErrorDefinition | null {
    return this.errors.get(errorCode) || null;
  }

  private loadDefaultErrors(): void {
    this.errors.set('ERR_AI_001', {
      errorCode: 'ERR_AI_001',
      description: 'AI Provider timed out before returning a response.',
      possibleCauses: ['Network disconnected', 'Provider outage', 'Request payload too large'],
      recommendedSolutions: ['Check network connection', 'Switch to fallback provider', 'Reduce prompt size'],
      relatedDocsUrl: '/docs/troubleshooting/ai-timeout'
    });
  }
}

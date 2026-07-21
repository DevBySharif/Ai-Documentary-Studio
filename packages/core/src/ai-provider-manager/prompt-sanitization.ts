export class APPromptSanitizationLayer {
  sanitize(prompt: string): string {
    return prompt.replace(/(api[_-]?key|secret|token|password)=[^\s]+/gi, "$1=REDACTED");
  }

  validateStructure(prompt: string): boolean {
    return prompt.length > 0 && prompt.length <= 128000;
  }

  formatForProvider(provider: string, prompt: string): string {
    return prompt;
  }
}

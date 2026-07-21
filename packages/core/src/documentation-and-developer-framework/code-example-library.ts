import { CodeExample } from './types';

export class CodeExampleLibrary {
  private examples: Map<string, CodeExample> = new Map();

  addExample(example: CodeExample): void {
    if (!example.isVerified) {
      console.warn(`Warning: Added unverified example ${example.id}. It should be tested against the current SDK.`);
    }
    this.examples.set(example.id, example);
  }

  getExamplesByCategory(category: string): CodeExample[] {
    return Array.from(this.examples.values()).filter(e => e.category === category);
  }
}

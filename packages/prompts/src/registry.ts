import { PromptTemplate, PromptBlock } from './models';

export class PromptRegistry {
  private templates: Map<string, PromptTemplate> = new Map();
  private blocks: Map<string, PromptBlock> = new Map();

  registerTemplate(template: PromptTemplate): void {
    const key = `${template.id}@${template.version}`;
    if (this.templates.has(key)) {
      throw new Error(`Template ${key} is already registered.`);
    }
    this.templates.set(key, template);
  }

  getTemplate(id: string, version: string): PromptTemplate {
    const key = `${id}@${version}`;
    const template = this.templates.get(key);
    if (!template) {
      throw new Error(`Template ${key} not found in registry.`);
    }
    return template;
  }

  registerBlock(block: PromptBlock): void {
    if (this.blocks.has(block.id)) {
      throw new Error(`Block ${block.id} is already registered.`);
    }
    this.blocks.set(block.id, block);
  }

  getBlock(id: string): PromptBlock {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block ${id} not found in registry.`);
    }
    return block;
  }
}

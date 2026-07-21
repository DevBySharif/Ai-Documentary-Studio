export interface SystemPromptBlock {
  readonly role: string;
  readonly guidelines: ReadonlyArray<string>;
}

export interface ContextBlock {
  readonly blockName: string;
  readonly content: string;
}

/**
 * Prompt Composition Engine (IB Part 18 - Section 7, Section 21).
 * Assembles prompts from structured components rather than concatenating arbitrary strings.
 */
export class PromptPipeline {
  private systemBlock: SystemPromptBlock = { role: "Documentary AI Assistant", guidelines: [] };
  private contextBlocks: ContextBlock[] = [];
  private taskPrompt = "";

  public setSystemRole(role: string, guidelines: string[] = []): this {
    this.systemBlock = { role, guidelines };
    return this;
  }

  public addContextBlock(blockName: string, content: string): this {
    this.contextBlocks.push({ blockName, content });
    return this;
  }

  public setTaskPrompt(prompt: string): this {
    this.taskPrompt = prompt;
    return this;
  }

  public buildSystemPrompt(): string {
    const guidelinesText = this.systemBlock.guidelines.map((g) => `- ${g}`).join("\n");
    return `You are a ${this.systemBlock.role}.\nGuidelines:\n${guidelinesText}`;
  }

  public buildUserPrompt(): string {
    const contextText = this.contextBlocks
      .map((b) => `--- CONTEXT [${b.blockName}] ---\n${b.content}`)
      .join("\n\n");

    return `${contextText}\n\n--- TASK ---\n${this.taskPrompt}`;
  }

  public reset(): void {
    this.contextBlocks = [];
    this.taskPrompt = "";
  }
}

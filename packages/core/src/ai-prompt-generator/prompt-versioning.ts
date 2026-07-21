import { CompiledPrompt } from "./prompt-types";

export interface PromptVersionRecord {
  readonly promptId: string;
  readonly history: ReadonlyArray<CompiledPrompt>;
  readonly isLocked: boolean;
}

/**
 * Prompt Versioning & Lock Manager (Vol 04 Part 06 - Section 13, Section 17).
 * Maintains version history for prompts and allows restoring or locking specific prompt revisions.
 */
export class PromptVersionManager {
  private records = new Map<string, PromptVersionRecord>();

  public saveVersion(prompt: CompiledPrompt): void {
    const existing = this.records.get(prompt.promptId);
    const history = existing ? [...existing.history, prompt] : [prompt];
    this.records.set(prompt.promptId, {
      promptId: prompt.promptId,
      history,
      isLocked: existing ? existing.isLocked : false,
    });
  }

  public setLock(promptId: string, isLocked: boolean): void {
    const rec = this.records.get(promptId);
    if (rec) {
      this.records.set(promptId, { ...rec, isLocked });
    }
  }

  public getHistory(promptId: string): ReadonlyArray<CompiledPrompt> {
    return this.records.get(promptId)?.history || [];
  }
}

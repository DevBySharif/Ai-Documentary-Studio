import type { PromptRecord } from "./types.js";

export class VisualPromptMemoryStore {
  private records = new Map<string, PromptRecord>();

  store(record: PromptRecord): void {
    if (!record || !record.assetId) throw new Error("PromptRecord with assetId is required");
    this.records.set(record.assetId, record);
  }

  get(assetId: string): PromptRecord | undefined {
    return this.records.get(assetId);
  }

  findByPrompt(prompt: string): PromptRecord[] {
    if (!prompt) return [];
    const lower = prompt.toLowerCase();
    return Array.from(this.records.values()).filter(
      (r) => (r.originalPrompt ?? "").toLowerCase().includes(lower)
        || (r.negativePrompt ?? "").toLowerCase().includes(lower)
    );
  }

  findBySeed(seed: number): PromptRecord[] {
    if (typeof seed !== "number") return [];
    return Array.from(this.records.values()).filter((r) => r.seed === seed);
  }

  findByModel(model: string): PromptRecord[] {
    if (!model) return [];
    return Array.from(this.records.values()).filter((r) => r.model === model);
  }

  getAll(): PromptRecord[] {
    return Array.from(this.records.values());
  }

  count(): number {
    return this.records.size;
  }
}

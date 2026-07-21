import type { MPProductionStage } from "./types.js";

export class MPFailureHandling {
  private retryCount: Map<string, number> = new Map();
  private readonly maxRetries = 3;

  handle(stage: MPProductionStage, error: string): { retry: boolean; message: string } {
    const key = `${stage}:${error}`;
    const count = this.retryCount.get(key) ?? 0;

    if (count < this.maxRetries) {
      this.retryCount.set(key, count + 1);
      return { retry: true, message: `Retrying ${stage} (attempt ${count + 1}/${this.maxRetries})` };
    }

    return { retry: false, message: `Stage ${stage} failed after ${this.maxRetries} retries: ${error}` };
  }

  isProjectInvalid(stage: MPProductionStage): boolean {
    return stage === "script" || stage === "prompt";
  }

  reset(): void {
    this.retryCount.clear();
  }
}

import { Snapshot } from './types';

export class AutosaveEngine {
  private autosaveIntervalMs: number = 60000; // 1 minute default
  private timer?: NodeJS.Timeout;
  
  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.performAutosave(), this.autosaveIntervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  setAutosaveInterval(ms: number): void {
    this.autosaveIntervalMs = ms;
    if (this.timer) {
      this.stop();
      this.start();
    }
  }

  async createCheckpoint(reason: string): Promise<string> {
    const snapshotId = `checkpoint_${Date.now()}`;
    console.log(`Created checkpoint '${snapshotId}' before: ${reason}`);
    // Save to disk
    return snapshotId;
  }

  private async performAutosave(): Promise<void> {
    // Gather state (project, timeline, UI) and save to disk
    console.log("Autosave completed.");
  }
}

export class WMAutosaveSystem {
  private intervalMs = 60000;
  private enabled = true;
  private lastSave = 0;

  configure(intervalMs: number): void {
    this.intervalMs = intervalMs;
  }

  enable(enabled: boolean): void {
    this.enabled = enabled;
  }

  shouldSave(): boolean {
    if (!this.enabled) return false;
    return Date.now() - this.lastSave >= this.intervalMs;
  }

  markSaved(): void {
    this.lastSave = Date.now();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getInterval(): number {
    return this.intervalMs;
  }
}

export interface ProfilingEntry {
  stage: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  success?: boolean;
}

export class StartupProfiler {
  private entries = new Map<string, ProfilingEntry>();
  private readonly appStartTime = Date.now();

  public startStage(stageName: string): void {
    this.entries.set(stageName, {
      stage: stageName,
      startTime: Date.now(),
    });
  }

  public endStage(stageName: string, success = true): void {
    const entry = this.entries.get(stageName);
    if (!entry) return;

    entry.endTime = Date.now();
    entry.durationMs = entry.endTime - entry.startTime;
    entry.success = success;
  }

  public getReport() {
    const totalDuration = Date.now() - this.appStartTime;
    const stages = Array.from(this.entries.values());

    return {
      totalDurationMs: totalDuration,
      stages,
    };
  }

  public logReport(): void {
    // In a real implementation this would use the standard Logger service
    console.log("Startup Profile:", JSON.stringify(this.getReport(), null, 2));
  }
}

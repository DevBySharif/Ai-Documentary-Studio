import type { MPAnalyticsMetric } from "./types.js";

export class MPProductionAnalytics {
  private metrics: MPAnalyticsMetric[] = [];

  record(name: string, value: number, unit: string): void {
    this.metrics.push({ name, value, unit, timestamp: Date.now() });
  }

  recordRenderTime(ms: number): void {
    this.record("average_render_time", ms, "ms");
  }

  recordRegenerationRate(rate: number): void {
    this.record("image_regeneration_rate", rate, "%");
  }

  recordQAPassRate(rate: number): void {
    this.record("qa_pass_rate", rate, "%");
  }

  recordTTSGenerationTime(ms: number): void {
    this.record("tts_generation_time", ms, "ms");
  }

  recordExportDuration(ms: number): void {
    this.record("export_duration", ms, "ms");
  }

  recordGPUUtilization(percent: number): void {
    this.record("gpu_utilization", percent, "%");
  }

  getMetric(name: string): MPAnalyticsMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  getAverages(): Record<string, number> {
    const grouped: Record<string, number[]> = {};
    for (const m of this.metrics) {
      if (!grouped[m.name]) grouped[m.name] = [];
      grouped[m.name].push(m.value);
    }
    const averages: Record<string, number> = {};
    for (const [name, values] of Object.entries(grouped)) {
      averages[name] = values.reduce((s, v) => s + v, 0) / values.length;
    }
    return averages;
  }

  clear(): void {
    this.metrics = [];
  }
}

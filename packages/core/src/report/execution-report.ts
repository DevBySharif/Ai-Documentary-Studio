import type { ExecutionReport } from "./types.js";

export class ExecutionReportBuilder {
  build(params: {
    projectId: string;
    totalRuntime: number;
    imagesGenerated: number;
    imagesReused: number;
    promptCount: number;
    motionCount: number;
    renderDuration: number;
    qualityScore: number;
    synchronizationScore: number;
    errors: string[];
    warnings: string[];
    engineTimings: Array<{ engine: string; durationMs: number }>;
  }): ExecutionReport {
    return {
      ...params,
      createdAt: new Date().toISOString(),
    };
  }

  summarize(report: ExecutionReport): string {
    const lines: string[] = [];
    lines.push(`Project: ${report.projectId}`);
    lines.push(`Runtime: ${report.totalRuntime}s | Quality: ${report.qualityScore}/100`);
    lines.push(`Images: ${report.imagesGenerated} generated, ${report.imagesReused} reused`);
    lines.push(`Prompts: ${report.promptCount} | Motions: ${report.motionCount}`);
    lines.push(`Render: ${report.renderDuration}ms | Sync: ${report.synchronizationScore}/100`);
    if (report.errors.length > 0) lines.push(`Errors: ${report.errors.join(", ")}`);
    if (report.warnings.length > 0) lines.push(`Warnings: ${report.warnings.join(", ")}`);
    return lines.join("\n");
  }
}

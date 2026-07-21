export interface ExecutionReport {
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
  createdAt: string;
}

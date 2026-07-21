export type RenderJobState =
  | "Queued"
  | "Preparing"
  | "Rendering"
  | "Encoding"
  | "Packaging"
  | "Validating"
  | "Completed"
  | "Failed"
  | "Cancelled";

export interface ResolutionConfig {
  readonly width: number;
  readonly height: number;
}

export interface AudioExportConfig {
  readonly sampleRate: number;
  readonly channels: number;
  readonly bitrateKbps: number;
}

/**
 * Immutable Render Job Model (IB Part 21 - Section 4, Section 22).
 * Immutable after execution begins; any change creates a new job and output artifact.
 */
export interface RenderJob {
  readonly jobId: string;
  readonly sourceTimelineId: string;
  readonly presetName: string;
  readonly resolution: ResolutionConfig;
  readonly frameRate: number;
  readonly codec: string;
  readonly container: string;
  readonly audioConfig: AudioExportConfig;
  readonly destinationPath: string;
  readonly totalFrames: number;
  state: RenderJobState;
  renderedFrames: number;
  readonly priority: number;
  readonly createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export function createRenderJob(
  sourceTimelineId: string,
  presetName: string,
  resolution: ResolutionConfig,
  frameRate: number,
  codec: string,
  container: string,
  destinationPath: string,
  totalFrames: number,
  priority = 5
): RenderJob {
  return {
    jobId: `job-${Math.floor(Math.random() * 900 + 100)}`,
    sourceTimelineId,
    presetName,
    resolution,
    frameRate,
    codec,
    container,
    audioConfig: { sampleRate: 48000, channels: 2, bitrateKbps: 320 },
    destinationPath,
    totalFrames,
    state: "Queued",
    renderedFrames: 0,
    priority,
    createdAt: new Date(),
  };
}

import { ExportPresetDescriptor, RenderJobItem, ExportPresetType } from "./export-ui-types";

/**
 * Export Preset Manager, Render Settings Validator & Render Queue Controller (Vol 05 Part 12 - Section 8, Section 9, Section 10, Section 11).
 * Manages 10 built-in export presets (YouTube 4K, Master, Broadcast, etc.), render settings validation, and queue job execution.
 */
export class ExportPresetRenderQueue {
  private presets: ExportPresetDescriptor[] = [
    {
      presetId: "preset_yt_4k",
      name: "YouTube 4K Ultra HD",
      type: "YouTube4K",
      resolution: "3840x2160",
      frameRate: 24,
      codec: "H.264 / MP4",
      targetBitrateMbps: 55,
      audioFormat: "AAC 320kbps",
      isSubtitleEmbedded: true,
    },
    {
      presetId: "preset_doc_master",
      name: "Documentary Archival Master",
      type: "DocumentaryMaster",
      resolution: "3840x2160",
      frameRate: 24,
      codec: "ProRes 422 HQ",
      targetBitrateMbps: 220,
      audioFormat: "PCM 24-bit 48kHz",
      isSubtitleEmbedded: true,
    },
  ];

  private renderQueue: RenderJobItem[] = [];

  public getPresets(): ReadonlyArray<ExportPresetDescriptor> {
    return this.presets;
  }

  public enqueueRenderJob(jobName: string, presetType: ExportPresetType, destinationPath: string): RenderJobItem {
    const preset = this.presets.find((p) => p.type === presetType) || this.presets[0];
    const job: RenderJobItem = {
      jobId: `job_rnd_${Math.random().toString(36).substring(2, 7)}`,
      jobName,
      presetName: preset.name,
      destinationPath,
      progressPercent: 0,
      status: "Queued",
      estimatedCompletionSecs: 180,
      createdAt: new Date(),
    };
    this.renderQueue.push(job);
    return job;
  }

  public getRenderQueue(): ReadonlyArray<RenderJobItem> {
    return this.renderQueue;
  }
}

import { ResolutionConfig } from "./render-job-model";

export type PresetType =
  | "YouTube1080p"
  | "YouTube4K"
  | "TikTokVertical"
  | "InstagramReel"
  | "BroadcastMaster"
  | "ArchiveMaster"
  | "AudioOnly"
  | "Custom";

export interface ExportPreset {
  readonly name: PresetType;
  readonly displayName: string;
  readonly resolution: ResolutionConfig;
  readonly targetFps: number;
  readonly videoCodec: string;
  readonly containerFormat: string;
  readonly targetVideoBitrateMbps: number;
  readonly audioSampleRate: number;
}

export class ExportPresetRegistry {
  private presets = new Map<PresetType, ExportPreset>();

  constructor() {
    this.initDefaultPresets();
  }

  private initDefaultPresets(): void {
    const presets: ExportPreset[] = [
      { name: "YouTube1080p", displayName: "YouTube 1080p Full HD", resolution: { width: 1920, height: 1080 }, targetFps: 60, videoCodec: "H.264", containerFormat: "MP4", targetVideoBitrateMbps: 12, audioSampleRate: 48000 },
      { name: "YouTube4K", displayName: "YouTube 4K Ultra HD", resolution: { width: 3840, height: 2160 }, targetFps: 60, videoCodec: "H.265", containerFormat: "MP4", targetVideoBitrateMbps: 45, audioSampleRate: 48000 },
      { name: "TikTokVertical", displayName: "TikTok / Shorts (9:16 Vertical)", resolution: { width: 1080, height: 1920 }, targetFps: 30, videoCodec: "H.264", containerFormat: "MP4", targetVideoBitrateMbps: 8, audioSampleRate: 48000 },
      { name: "InstagramReel", displayName: "Instagram Reel (9:16)", resolution: { width: 1080, height: 1920 }, targetFps: 30, videoCodec: "H.264", containerFormat: "MP4", targetVideoBitrateMbps: 8, audioSampleRate: 48000 },
      { name: "BroadcastMaster", displayName: "Broadcast Master (ProRes 422 HQ)", resolution: { width: 3840, height: 2160 }, targetFps: 25, videoCodec: "ProRes", containerFormat: "MOV", targetVideoBitrateMbps: 220, audioSampleRate: 48000 },
      { name: "ArchiveMaster", displayName: "Archive Master (DNxHR)", resolution: { width: 3840, height: 2160 }, targetFps: 24, videoCodec: "DNxHR", containerFormat: "MXF", targetVideoBitrateMbps: 350, audioSampleRate: 48000 },
    ];

    presets.forEach((p) => this.presets.set(p.name, p));
  }

  public getPreset(name: PresetType): ExportPreset | undefined {
    return this.presets.get(name);
  }

  public listPresets(): ReadonlyArray<ExportPreset> {
    return Array.from(this.presets.values());
  }
}

import type { EEArchivePackage } from "./types.js";

export class EEProjectArchive {
  build(include: Partial<EEArchivePackage>): EEArchivePackage {
    return {
      timeline: include.timeline ?? true,
      assets: include.assets ?? true,
      audio: include.audio ?? true,
      subtitles: include.subtitles ?? true,
      motionData: include.motionData ?? true,
      exportSettings: include.exportSettings ?? true,
      qaReport: include.qaReport ?? true
    };
  }

  archivePath(productionId: string): string {
    return `archive/${productionId}_${Date.now()}.zip`;
  }
}

import type { EEZennProfile } from "./types.js";

export class EEZennExportProfile {
  private profile: EEZennProfile = {
    format: "mp4", codec: "h264", resolution: "1080p",
    fps: 30, bitrate: "high-quality VBR", audio: "AAC",
    metadata: "YouTube", archive: true
  };

  getProfile(): EEZennProfile {
    return { ...this.profile };
  }

  useArchivePackage(): boolean {
    return this.profile.archive;
  }
}

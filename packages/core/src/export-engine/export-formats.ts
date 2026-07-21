import type { EEFormat } from "./types.js";

export class EEExportFormats {
  private readonly formats: EEFormat[] = ["mp4", "mov", "mkv", "webm", "image_sequence"];

  isSupported(format: EEFormat): boolean {
    return this.formats.includes(format);
  }

  getFormats(): EEFormat[] {
    return [...this.formats];
  }

  getMimeType(format: EEFormat): string {
    const map: Record<EEFormat, string> = {
      mp4: "video/mp4", mov: "video/quicktime", mkv: "video/x-matroska",
      webm: "video/webm", image_sequence: "image/png"
    };
    return map[format];
  }

  getExtension(format: EEFormat): string {
    const map: Record<EEFormat, string> = {
      mp4: ".mp4", mov: ".mov", mkv: ".mkv", webm: ".webm", image_sequence: ".png"
    };
    return map[format];
  }
}

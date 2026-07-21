import type { EEValidationResult } from "./types.js";

export class EEExportValidator {
  validate(video: boolean, audio: boolean, subtitles: boolean, metadata: boolean, codec: boolean, container: boolean): EEValidationResult {
    return { videoStream: video, audioStream: audio, subtitlePackage: subtitles, metadata, codecSupport: codec, containerIntegrity: container, passed: video && audio && subtitles && metadata && codec && container };
  }

  printReport(result: EEValidationResult): string[] {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(result)) {
      if (key === "passed") continue;
      const status = value ? "✓" : "✗";
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      lines.push(`${status} ${label}`);
    }
    return lines;
  }
}

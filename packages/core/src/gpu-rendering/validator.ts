import type { GRValidationResult } from "./types.js";

export class GRGPUValidator {
  validate(gpuMemoryOK: boolean, frameQueueOK: boolean, subtitlesOK: boolean, audioOK: boolean, profileOK: boolean, encoderOK: boolean): GRValidationResult {
    return {
      gpuMemory: gpuMemoryOK,
      frameQueue: frameQueueOK,
      subtitleLayers: subtitlesOK,
      audioTrack: audioOK,
      exportProfile: profileOK,
      encoderAvailable: encoderOK,
      passed: gpuMemoryOK && frameQueueOK && subtitlesOK && audioOK && profileOK && encoderOK
    };
  }

  printReport(result: GRValidationResult): string[] {
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

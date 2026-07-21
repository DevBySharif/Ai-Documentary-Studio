import type { FSValidationResult } from "./types.js";

export class FSFrameSchedulerValidator {
  validate(
    frameCountOK: boolean,
    audioAligned: boolean,
    subtitleAligned: boolean,
    cameraAligned: boolean,
    effectTimingOK: boolean,
    timelineOK: boolean
  ): FSValidationResult {
    return {
      frameCount: frameCountOK,
      audioAlignment: audioAligned,
      subtitleAlignment: subtitleAligned,
      cameraAlignment: cameraAligned,
      effectTiming: effectTimingOK,
      timelineIntegrity: timelineOK,
      passed: frameCountOK && audioAligned && subtitleAligned && cameraAligned && effectTimingOK && timelineOK
    };
  }

  printReport(result: FSValidationResult): string[] {
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

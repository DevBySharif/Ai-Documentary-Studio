import type { PDValidationResult } from "./types.js";

export class PDProductionValidator {
  validate(prevApproved: boolean, assets: boolean, timeline: boolean, audio: boolean, scene: boolean, dna: boolean): PDValidationResult {
    return { previousStageApproved: prevApproved, assetsAvailable: assets, timelineValid: timeline, audioSynchronized: audio, sceneComplete: scene, channelDNAPreserved: dna, passed: prevApproved && assets && timeline && audio && scene && dna };
  }

  printReport(result: PDValidationResult): string[] {
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

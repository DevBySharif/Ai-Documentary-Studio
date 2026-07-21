import type { QualityGate, AutoRepairAction, QualityScorecard } from "./types.js";

export class QualityGatesEngine {
  readonly GATES = [
    { name: "Research", requiredScore: 60 },
    { name: "Story", requiredScore: 70 },
    { name: "Prompt", requiredScore: 70 },
    { name: "Image", requiredScore: 65 },
    { name: "Motion", requiredScore: 65 },
    { name: "Audio", requiredScore: 70 },
    { name: "Sync", requiredScore: 75 },
    { name: "Final Approval", requiredScore: 80 },
  ] as const;

  evaluate(scorecard: QualityScorecard, repairs: AutoRepairAction[]): QualityGate[] {
    return this.GATES.map((gate, index) => {
      let score = 0;
      const failures: string[] = [];

      switch (gate.name) {
        case "Research": {
          score = scorecard.overall > 0 ? 85 : 0;
          break;
        }
        case "Story": {
          score = scorecard.story.score;
          if (!scorecard.story.passed) failures.push("Story quality below threshold");
          if (scorecard.story.warnings.length > 2) failures.push("Too many story warnings");
          break;
        }
        case "Prompt": {
          score = scorecard.prompt.score;
          if (!scorecard.prompt.passed) failures.push("Prompt quality below threshold");
          break;
        }
        case "Image": {
          score = scorecard.image.score;
          if (!scorecard.image.passed) failures.push("Image quality below threshold");
          break;
        }
        case "Motion": {
          score = scorecard.motion.score;
          if (!scorecard.motion.passed) failures.push("Motion quality below threshold");
          break;
        }
        case "Audio": {
          score = scorecard.audio.score;
          if (!scorecard.audio.passed) failures.push("Audio quality below threshold");
          break;
        }
        case "Sync": {
          score = scorecard.synchronization.score;
          if (!scorecard.synchronization.passed) failures.push("Sync quality below threshold");
          if (repairs.some((r) => r.type === "retime_scene")) failures.push("Retime required before sync gate");
          break;
        }
        case "Final Approval": {
          score = scorecard.overall;
          if (scorecard.status !== "ready") failures.push("All issues must be resolved");
          if (repairs.some((r) => r.priority <= 2 && !r.automatic)) {
            failures.push("Manual repairs pending");
          }
          break;
        }
      }

      const passed = score >= gate.requiredScore && failures.length === 0;

      return {
        name: gate.name,
        index,
        passed,
        score,
        requiredScore: gate.requiredScore,
        failures,
      };
    });
  }
}

import type { AMOutputContract } from "./types.js";

export class AMOutputContractBuilder {
  build(voiceClean: boolean, musicBalanced: boolean, loudnessProfile: string, truePeakSafe: boolean, ready: boolean): AMOutputContract {
    return {
      voice: voiceClean ? "Clean" : "Needs Correction",
      music: musicBalanced ? "Balanced" : "Needs Adjustment",
      loudness: loudnessProfile,
      truePeak: truePeakSafe ? "Safe" : "Clipping Detected",
      status: ready ? "Ready" : "Needs Review"
    };
  }

  isReady(contract: AMOutputContract): boolean {
    return contract.voice === "Clean" && contract.music === "Balanced" && contract.truePeak === "Safe" && contract.status === "Ready";
  }

  summary(contract: AMOutputContract): string {
    return `Voice: ${contract.voice} | Music: ${contract.music} | Loudness: ${contract.loudness} | True Peak: ${contract.truePeak} | Status: ${contract.status}`;
  }
}

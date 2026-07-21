import type { FSOutputContract, FSFramerate } from "./types.js";

export class FSOutputContractBuilder {
  build(fps: FSFramerate, totalFrames: number, totalEvents: number, syncPerfect: boolean, ready: boolean): FSOutputContract {
    return {
      fps,
      frames: totalFrames,
      events: totalEvents,
      sync: syncPerfect ? "Perfect" : "Drift Detected",
      status: ready ? "Ready" : "Needs Review"
    };
  }

  isReady(contract: FSOutputContract): boolean {
    return contract.sync === "Perfect" && contract.status === "Ready";
  }

  summary(contract: FSOutputContract): string {
    return `FPS: ${contract.fps} | Frames: ${contract.frames} | Events: ${contract.events} | Sync: ${contract.sync} | Status: ${contract.status}`;
  }
}

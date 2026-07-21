import type { GROutputContract } from "./types.js";

export class GROutputContractBuilder {
  build(backend: string, encoder: string, fps: number, resolution: string, renderTime: string, success: boolean): GROutputContract {
    return { backend, encoder, fps, resolution, renderTime, status: success ? "Success" : "Failed" };
  }

  isSuccess(contract: GROutputContract): boolean {
    return contract.status === "Success";
  }

  summary(contract: GROutputContract): string {
    return `Backend: ${contract.backend} | Encoder: ${contract.encoder} | FPS: ${contract.fps} | Resolution: ${contract.resolution} | Time: ${contract.renderTime} | Status: ${contract.status}`;
  }
}

import type { EEOutputContract } from "./types.js";

export class EEOutputContractBuilder {
  build(format: string, codec: string, resolution: string, fps: number, platform: string, exported: boolean): EEOutputContract {
    return { format, codec, resolution, fps, platform, status: exported ? "Exported" : "Failed" };
  }

  isExported(contract: EEOutputContract): boolean {
    return contract.status === "Exported";
  }

  summary(contract: EEOutputContract): string {
    return `Format: ${contract.format} | Codec: ${contract.codec} | Resolution: ${contract.resolution} | FPS: ${contract.fps} | Platform: ${contract.platform} | Status: ${contract.status}`;
  }
}

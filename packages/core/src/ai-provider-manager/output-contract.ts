import type { APOutputContract, APProviderName } from "./types.js";

export class APOutputContractBuilder {
  build(provider: APProviderName, model: string, success: boolean, latency: string, cached: boolean): APOutputContract {
    return { provider, model, status: success ? "Success" : "Failed", latency, cached };
  }

  isSuccess(contract: APOutputContract): boolean {
    return contract.status === "Success";
  }

  summary(contract: APOutputContract): string {
    return `Provider: ${contract.provider} | Model: ${contract.model} | Status: ${contract.status} | Latency: ${contract.latency} | Cached: ${contract.cached}`;
  }
}

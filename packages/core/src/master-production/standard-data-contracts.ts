import type { MPDataContract } from "./types.js";

export class MPStandardDataContracts {
  create(version: string, source: string, payload: Record<string, unknown>): MPDataContract {
    return { version, source, timestamp: Date.now(), validationStatus: "pending", payload };
  }

  validate(contract: MPDataContract): MPDataContract {
    return { ...contract, validationStatus: contract.payload ? "valid" : "invalid" };
  }

  isReady(contract: MPDataContract): boolean {
    return contract.validationStatus === "valid";
  }
}

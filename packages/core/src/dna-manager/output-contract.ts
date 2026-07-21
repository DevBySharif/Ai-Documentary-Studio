import type { DNAOutputContract } from "./types.js";

export class DNAOutputContractBuilder {
  build(channel: string, version: string, validated: boolean, locked: boolean, compatible: boolean): DNAOutputContract {
    return {
      channel,
      dnaVersion: version,
      status: validated ? "Validated" : "Invalid",
      locked,
      compatible
    };
  }

  isReady(contract: DNAOutputContract): boolean {
    return contract.status === "Validated" && contract.compatible;
  }

  summary(contract: DNAOutputContract): string {
    return `Channel: ${contract.channel} | DNA: ${contract.dnaVersion} | Status: ${contract.status} | Locked: ${contract.locked} | Compatible: ${contract.compatible}`;
  }
}

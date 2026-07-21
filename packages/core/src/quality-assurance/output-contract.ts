import type { QAOutputContract } from "./types.js";

export class QAOutputContractBuilder {
  build(overallScore: number, warnings: number, critical: number, autoFixed: number): QAOutputContract {
    return {
      overallScore: Math.round(overallScore * 10) / 10,
      status: critical > 0 ? "Rejected" : overallScore >= 85 ? "Approved" : "Needs Review",
      warnings,
      critical,
      autoFixed
    };
  }

  isApproved(contract: QAOutputContract): boolean {
    return contract.status === "Approved";
  }

  summary(contract: QAOutputContract): string {
    return `Score: ${contract.overallScore} | Status: ${contract.status} | Warnings: ${contract.warnings} | Critical: ${contract.critical} | Auto-fixed: ${contract.autoFixed}`;
  }
}

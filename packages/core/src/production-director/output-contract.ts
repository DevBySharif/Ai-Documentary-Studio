import type { PDOutputContract } from "./types.js";

export class PDOutputContractBuilder {
  build(projectCompleted: boolean, approvedScenes: number, qaPassed: boolean, exportReady: boolean): PDOutputContract {
    return {
      project: projectCompleted ? "Completed" : "In Progress",
      approvedScenes,
      qa: qaPassed ? "Passed" : "Failed",
      export: exportReady ? "Ready" : "Pending",
      status: projectCompleted && qaPassed && exportReady ? "Success" : "In Progress"
    };
  }

  isComplete(contract: PDOutputContract): boolean {
    return contract.status === "Success";
  }

  summary(contract: PDOutputContract): string {
    return `Project: ${contract.project} | Scenes: ${contract.approvedScenes} | QA: ${contract.qa} | Export: ${contract.export} | Status: ${contract.status}`;
  }
}

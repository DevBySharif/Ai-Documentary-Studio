import type { MPOutputContract } from "./types.js";

export class MPOutputContractBuilder {
  build(completed: boolean, pipelineSuccess: boolean, qaPassed: boolean, exportReady: boolean, dnaLoaded: boolean): MPOutputContract {
    return {
      project: completed ? "Completed" : "In Progress",
      pipeline: pipelineSuccess ? "Success" : "Failed",
      qa: qaPassed ? "Passed" : "Failed",
      export: exportReady ? "Ready" : "Pending",
      channelDna: dnaLoaded ? "Loaded" : "Missing",
      status: completed && pipelineSuccess && qaPassed && exportReady && dnaLoaded ? "Production Complete" : "In Progress"
    };
  }

  isComplete(contract: MPOutputContract): boolean {
    return contract.status === "Production Complete";
  }

  summary(contract: MPOutputContract): string {
    return `Project: ${contract.project} | Pipeline: ${contract.pipeline} | QA: ${contract.qa} | Export: ${contract.export} | DNA: ${contract.channelDna} | Status: ${contract.status}`;
  }
}

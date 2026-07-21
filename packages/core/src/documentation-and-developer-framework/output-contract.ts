import { OutputContract } from './types';

export class OutputContractBuilder {
  buildContract(
    documentationStatus: string,
    apiStatus: string,
    architectureStatus: string,
    knowledgeBaseStatus: string,
    overallStatus: string
  ): OutputContract {
    return {
      documentation: documentationStatus,
      api: apiStatus,
      architecture: architectureStatus,
      knowledgeBase: knowledgeBaseStatus,
      status: overallStatus
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

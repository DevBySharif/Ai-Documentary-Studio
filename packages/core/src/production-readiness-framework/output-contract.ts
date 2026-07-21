import { OutputContract } from './types';

export class OutputContractBuilder {
  buildContract(
    release: string,
    certification: string,
    goLive: boolean,
    riskLevel: string,
    status: string
  ): OutputContract {
    return {
      release,
      certification,
      goLive,
      riskLevel,
      status
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

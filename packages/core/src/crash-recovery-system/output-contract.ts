import { OutputContract, RecoveryState } from './types';

export class OutputContractBuilder {
  buildContract(crashDetected: boolean, state: RecoveryState, restoredJobs: number, lostAssets: number, status: string): OutputContract {
    return {
      crashDetected,
      recovery: state,
      restoredJobs,
      lostAssets,
      status
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

import { OutputContract } from './types';

export class OutputContractBuilder {
  buildContract(
    tests: number,
    passed: number,
    failed: number,
    coverage: string,
    status: string
  ): OutputContract {
    return {
      tests,
      passed,
      failed,
      coverage,
      status
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

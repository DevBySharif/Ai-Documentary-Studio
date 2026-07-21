import { OutputContract } from './types';

export class OutputContractBuilder {
  buildContract(
    buildVersion: string,
    channel: string,
    signed: boolean,
    verified: boolean,
    status: string
  ): OutputContract {
    return {
      build: buildVersion,
      channel,
      signed,
      verified,
      status
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

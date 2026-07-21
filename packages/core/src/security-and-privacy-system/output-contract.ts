import { OutputContract } from './types';

export class OutputContractBuilder {
  buildContract(
    vaultStatus: string,
    encryptionStatus: string,
    pluginStatus: string,
    auditStatus: string,
    overallStatus: string
  ): OutputContract {
    return {
      vault: vaultStatus,
      encryption: encryptionStatus,
      plugins: pluginStatus,
      audit: auditStatus,
      status: overallStatus
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

import { UpdateOutputContract, VersionInfo, UpdateStatus } from './types';

export class OutputContractBuilder {
  buildContract(currentVersion: VersionInfo, status: UpdateStatus, availableVersion?: VersionInfo, backupStatus?: string): UpdateOutputContract {
    const formatVersion = (v: VersionInfo) => `${v.major}.${v.minor}.${v.patch}`;
    
    return {
      currentVersion: formatVersion(currentVersion),
      availableVersion: availableVersion ? formatVersion(availableVersion) : undefined,
      status,
      backup: backupStatus || (status === "BackingUp" ? "InProgress" : (status === "Installing" || status === "Ready") ? "Completed" : "NotStarted")
    };
  }

  toJSON(contract: UpdateOutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

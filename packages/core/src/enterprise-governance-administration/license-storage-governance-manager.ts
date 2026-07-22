import { LicenseDescriptor, LicenseType } from "./governance-types";

export interface StorageGovernanceQuotaReport {
  readonly workspaceId: string;
  readonly allocatedQuotaBytes: number;
  readonly usedQuotaBytes: number;
  readonly percentageUsed: number;
  readonly isQuotaExceeded: boolean;
}

/**
 * License Management Engine & Storage Quota Governance (Vol 08 Part 07 - Section 9, Section 10).
 * Manages 5 enterprise license types (`NamedUser`, `Floating`, `Team`, `Educational`, `Enterprise`) and storage quota governance.
 */
export class LicenseStorageGovernanceManager {
  private licenses = new Map<string, LicenseDescriptor>();

  public allocateEnterpriseLicense(organizationId: string, licenseType: LicenseType, totalSeats = 25): LicenseDescriptor {
    const lic: LicenseDescriptor = {
      licenseId: `lic_${Math.random().toString(36).substring(2, 7)}`,
      organizationId,
      licenseType,
      allocatedSeatsCount: totalSeats,
      activeUsedSeatsCount: 5,
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000), // 1 year
    };

    this.licenses.set(lic.licenseId, lic);
    return lic;
  }

  public getStorageQuotaReport(workspaceId: string, usedBytes = 42949672960): StorageGovernanceQuotaReport {
    const allocated = 107374182400; // 100 GB
    const percentage = Math.floor((usedBytes / allocated) * 100);

    return {
      workspaceId,
      allocatedQuotaBytes: allocated,
      usedQuotaBytes: usedBytes,
      percentageUsed: percentage,
      isQuotaExceeded: usedBytes > allocated,
    };
  }
}

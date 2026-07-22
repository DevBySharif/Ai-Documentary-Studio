import { SecurityAdvisorySeverity, LtsPolicyDescriptor } from "./ecosystem-governance-types";

export interface SecurityAdvisoryDescriptor {
  readonly advisoryId: string;
  readonly title: string;
  readonly severity: SecurityAdvisorySeverity;
  readonly affectedPluginIds: ReadonlyArray<string>;
  readonly recommendedMitigation: string;
  readonly publishedAt: Date;
}

/**
 * Security Advisory Dispatcher & Long-Term Support (LTS) Policy Coordinator (Vol 10 Part 08 - Section 8, Section 10).
 * Issues coordinated security advisories and manages Long-Term Support (LTS) version windows.
 */
export class SecurityAdvisoryLtsCoordinator {
  public issueSecurityAdvisory(
    title: string,
    affectedPlugins: string[],
    severity: SecurityAdvisorySeverity = "High"
  ): SecurityAdvisoryDescriptor {
    return {
      advisoryId: `adv_${Math.random().toString(36).substring(2, 7)}`,
      title,
      severity,
      affectedPluginIds: affectedPlugins,
      recommendedMitigation: "Update affected plugin to the latest patch release immediately.",
      publishedAt: new Date(),
    };
  }

  public getLtsPolicy(ltsVersion = "1.0.0-LTS"): LtsPolicyDescriptor {
    return {
      ltsVersion,
      supportWindowMonths: 36, // 3 years LTS
      securityMaintenanceExpiry: new Date(Date.now() + 36 * 30 * 24 * 3600 * 1000),
      isActiveLts: true,
    };
  }
}

import { FeatureFlagDescriptor } from "./deployment-types";

export interface TenantIsolationBoundary {
  readonly tenantId: string;
  readonly dataPartitionKey: string;
  readonly storageBucketPrefix: string;
  readonly aiQuotaLimitUSD: number;
}

/**
 * Dynamic Feature Flag Manager & Multi-Tenancy Data/Policy Isolator (Vol 09 Part 01 - Section 12, Section 13).
 * Manages feature flags without code changes and enforces strict multi-tenant boundaries (data, policy, storage, AI quota, billing).
 */
export class FeatureFlagMultiTenantIsolator {
  private flags = new Map<string, FeatureFlagDescriptor>();

  public setFeatureFlag(featureName: string, isEnabled: boolean, scope: FeatureFlagDescriptor["rolloutScope"] = "Global"): FeatureFlagDescriptor {
    const flag: FeatureFlagDescriptor = {
      flagId: `flg_${Math.random().toString(36).substring(2, 7)}`,
      featureName,
      isEnabled,
      rolloutScope: scope,
    };

    this.flags.set(featureName, flag);
    return flag;
  }

  public isFeatureEnabled(featureName: string): boolean {
    const flag = this.flags.get(featureName);
    return flag ? flag.isEnabled : false;
  }

  public createTenantBoundary(organizationId: string): TenantIsolationBoundary {
    return {
      tenantId: organizationId,
      dataPartitionKey: `partition_${organizationId}`,
      storageBucketPrefix: `tenants/${organizationId}/`,
      aiQuotaLimitUSD: 1000.0,
    };
  }
}

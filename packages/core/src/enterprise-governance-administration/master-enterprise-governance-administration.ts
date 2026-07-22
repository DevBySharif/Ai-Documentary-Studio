import { OrganizationHierarchyManager } from "./organization-hierarchy-manager";
import { WorkspaceLifecyclePolicyCascader } from "./workspace-lifecycle-policy-cascader";
import { LicenseStorageGovernanceManager } from "./license-storage-governance-manager";
import { DelegatedAdminComplianceAuditVault } from "./delegated-admin-compliance-audit-vault";

/**
 * Master Enterprise Governance Administration Engine (Main Vol 08 Part 07).
 * Core entry point for 7-layer enterprise hierarchy (`Organization → Division → Department → Team → Workspace → Project → Assets`).
 */
export class MasterEnterpriseGovernanceAdministration {
  public readonly hierarchyManager = new OrganizationHierarchyManager();
  public readonly lifecyclePolicyCascader = new WorkspaceLifecyclePolicyCascader();
  public readonly licenseStorageManager = new LicenseStorageGovernanceManager();
  public readonly adminAuditVault = new DelegatedAdminComplianceAuditVault();

  public initEnterpriseGovernance(
    organizationName: string,
    adminUserId: string
  ): {
    org: ReturnType<OrganizationHierarchyManager["createOrganization"]>;
    license: ReturnType<LicenseStorageGovernanceManager["allocateEnterpriseLicense"]>;
  } {
    const org = this.hierarchyManager.createOrganization(organizationName, adminUserId);
    const license = this.licenseStorageManager.allocateEnterpriseLicense(org.organizationId, "Enterprise", 50);

    this.adminAuditVault.logEnterpriseAudit(org.organizationId, adminUserId, "WorkspaceLifecycle", "Enterprise Governance Initialized");

    return {
      org,
      license,
    };
  }
}

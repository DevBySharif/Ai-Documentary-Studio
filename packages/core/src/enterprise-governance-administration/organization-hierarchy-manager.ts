import { OrganizationDescriptor, DepartmentDescriptor } from "./governance-types";

/**
 * Organization, Division, Department & Team Hierarchy Manager (Vol 08 Part 07 - Section 3, Section 4, Section 5, Section 6).
 * Configures top-level enterprise hierarchy (`Organization → Division → Department → Team → Workspace → Project → Assets`).
 */
export class OrganizationHierarchyManager {
  private orgs = new Map<string, OrganizationDescriptor>();

  public createOrganization(organizationName: string, primaryAdminUserId: string): OrganizationDescriptor {
    const defaultDepts: DepartmentDescriptor[] = [
      { departmentId: "dept_res_1", departmentName: "Research", departmentLeadUserId: primaryAdminUserId, memberUserIds: [primaryAdminUserId] },
      { departmentId: "dept_prod_1", departmentName: "Production", departmentLeadUserId: primaryAdminUserId, memberUserIds: [primaryAdminUserId] },
      { departmentId: "dept_qa_1", departmentName: "Quality Assurance", departmentLeadUserId: primaryAdminUserId, memberUserIds: [primaryAdminUserId] },
    ];

    const org: OrganizationDescriptor = {
      organizationId: `org_${Math.random().toString(36).substring(2, 7)}`,
      organizationName,
      divisionsCount: 2,
      departments: defaultDepts,
      primaryAdminUserId,
      createdAt: new Date(),
    };

    this.orgs.set(org.organizationId, org);
    return org;
  }

  public getOrganization(organizationId: string): OrganizationDescriptor | undefined {
    return this.orgs.get(organizationId);
  }
}

import { ProjectBranchDescriptor } from "./version-control-types";

/**
 * Project Branching Engine & Branch Protection Enforcer (Vol 08 Part 03 - Section 6, Section 7, Section 14).
 * Creates isolated branches (`Main`, `Client Revision`, `Experimental AI`, `Director Cut`) and enforces branch protection rules.
 */
export class BranchingProtectionManager {
  private branches = new Map<string, ProjectBranchDescriptor>();

  constructor() {
    this.initDefaultMainBranch("proj_default");
  }

  private initDefaultMainBranch(projectId: string): void {
    const mainBranch: ProjectBranchDescriptor = {
      branchId: `br_main_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      branchName: "main",
      purpose: "Primary production release branch",
      isProtected: true,
      createdByUserId: "sys_admin",
      createdAt: new Date(),
    };
    this.branches.set("main", mainBranch);
  }

  public createBranch(
    projectId: string,
    branchName: string,
    parentBranchName: string,
    purpose: string,
    createdByUserId: string
  ): ProjectBranchDescriptor {
    const branch: ProjectBranchDescriptor = {
      branchId: `br_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      branchName,
      parentBranchName,
      purpose,
      isProtected: branchName === "main",
      createdByUserId,
      createdAt: new Date(),
    };

    this.branches.set(branchName, branch);
    return branch;
  }

  public canModifyBranch(branchName: string, userRole: string): boolean {
    const branch = this.branches.get(branchName);
    if (!branch) return true;
    if (branch.isProtected && userRole !== "Administrator" && userRole !== "Producer") {
      return false;
    }
    return true;
  }
}

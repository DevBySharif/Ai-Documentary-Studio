import { ProjectSnapshot, ProjectBranch } from "./project-types";

/**
 * Versioning, Snapshots & Branching Engine (Vol 05 Part 03 - Section 9, Section 10, Section 11).
 * Manages recoverable versions, immutable manual snapshots, and experimental project branches.
 */
export class ProjectVersioningBranches {
  private snapshots: ProjectSnapshot[] = [];
  private branches: ProjectBranch[] = [
    { branchId: "branch_main", branchName: "Main Version", createdAt: new Date(), isActive: true },
  ];

  public createSnapshot(milestoneName: string, description: string): ProjectSnapshot {
    const snapshot: ProjectSnapshot = {
      snapshotId: `snap_${Math.random().toString(36).substring(2, 7)}`,
      milestoneName,
      description,
      createdAt: new Date(),
      isImmutable: true,
    };
    this.snapshots.push(snapshot);
    return snapshot;
  }

  public createExperimentalBranch(branchName: string, parentBranchId = "branch_main"): ProjectBranch {
    const branch: ProjectBranch = {
      branchId: `branch_${Math.random().toString(36).substring(2, 7)}`,
      branchName,
      parentBranchId,
      createdAt: new Date(),
      isActive: false,
    };
    this.branches.push(branch);
    return branch;
  }

  public getSnapshots(): ReadonlyArray<ProjectSnapshot> {
    return this.snapshots;
  }

  public getBranches(): ReadonlyArray<ProjectBranch> {
    return this.branches;
  }
}

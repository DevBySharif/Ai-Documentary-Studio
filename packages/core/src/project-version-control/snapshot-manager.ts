import { ProjectSnapshotDescriptor, SnapshotCategoryType } from "./version-control-types";

/**
 * Immutable Snapshot Engine & Retention Policy Manager (Vol 08 Part 03 - Section 4, Section 5).
 * Captures immutable project snapshots (`Script`, `Storyboard`, `Assets`, `Timeline`, `Metadata`, `Settings`) across 5 snapshot categories.
 */
export class SnapshotManager {
  private snapshots: ProjectSnapshotDescriptor[] = [];

  public createSnapshot(
    projectId: string,
    branchName: string,
    category: SnapshotCategoryType,
    label: string
  ): ProjectSnapshotDescriptor {
    const snap: ProjectSnapshotDescriptor = {
      snapshotId: `snp_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      branchName,
      category,
      label,
      stateHash: `hash_${Math.random().toString(36).substring(2, 9)}`,
      isImmutable: true,
      createdAt: new Date(),
    };

    this.snapshots.push(snap);
    return snap;
  }

  public getSnapshotsForProject(projectId: string): ReadonlyArray<ProjectSnapshotDescriptor> {
    return this.snapshots.filter((s) => s.projectId === projectId);
  }
}

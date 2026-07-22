import { SnapshotManager } from "./snapshot-manager";
import { BranchingProtectionManager } from "./branching-protection-manager";
import { MergingChangesetEngine } from "./merging-changeset-engine";
import { VersionComparatorRestorationVault } from "./version-comparator-restoration-vault";
import { SnapshotCategoryType } from "./version-control-types";

/**
 * Master Project Version Control Engine (Main Vol 08 Part 03).
 * Core entry point for 6-layer version architecture (`Workspace → Project → Branch → Snapshot → Assets → Changes`).
 */
export class MasterProjectVersionControl {
  public readonly snapshotManager = new SnapshotManager();
  public readonly branchingManager = new BranchingProtectionManager();
  public readonly mergingChangesetEngine = new MergingChangesetEngine();
  public readonly comparatorVault = new VersionComparatorRestorationVault();

  public createProjectSnapshot(
    projectId: string,
    branchName: string,
    category: SnapshotCategoryType,
    label: string
  ): ReturnType<SnapshotManager["createSnapshot"]> {
    return this.snapshotManager.createSnapshot(projectId, branchName, category, label);
  }
}

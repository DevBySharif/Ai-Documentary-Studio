import { SharedAssetDescriptor, AssetVisibilityLevel, CollaborativeTaskAssignment } from "./collaboration-types";

/**
 * Shared Asset Visibility & Task Assignment Manager (Vol 08 Part 01 - Section 9, Section 10, Section 11).
 * Manages shared asset visibilities (`Private`, `ProjectShared`, `WorkspaceShared`, `OrgWide`) and human-AI task assignments.
 */
export class SharedAssetTaskAssignment {
  private sharedAssets: SharedAssetDescriptor[] = [];
  private tasks: CollaborativeTaskAssignment[] = [];

  public registerSharedAsset(
    assetName: string,
    ownerId: string,
    visibility: AssetVisibilityLevel,
    fileType: string
  ): SharedAssetDescriptor {
    const asset: SharedAssetDescriptor = {
      assetId: `ast_sh_${Math.random().toString(36).substring(2, 7)}`,
      assetName,
      ownerId,
      visibility,
      fileType,
      sharedAt: new Date(),
    };

    this.sharedAssets.push(asset);
    return asset;
  }

  public assignProductionTask(
    title: string,
    assigneeType: CollaborativeTaskAssignment["assigneeType"],
    assigneeId: string
  ): CollaborativeTaskAssignment {
    const task: CollaborativeTaskAssignment = {
      taskId: `tsk_collab_${Math.random().toString(36).substring(2, 7)}`,
      title,
      assigneeType,
      assigneeId,
      status: "Pending",
    };

    this.tasks.push(task);
    return task;
  }
}

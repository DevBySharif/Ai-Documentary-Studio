import { WorkspaceStructureMembership } from "./workspace-structure-membership";
import { RoleIsolationPermissions } from "./role-isolation-permissions";
import { SharedAssetTaskAssignment } from "./shared-asset-task-assignment";
import { AiAttributionWorkspacePolicy } from "./ai-attribution-workspace-policy";
import { WorkspaceCategoryType } from "./collaboration-types";

/**
 * Master Enterprise Collaboration Workspace Engine (Main Vol 08 Part 01).
 * Core entry point for 8-layer collaboration architecture (`Workspace → Projects → Teams → Roles → Tasks → Assets → AIServices → Integrations`).
 */
export class MasterEnterpriseCollaboration {
  public readonly workspaceMembership = new WorkspaceStructureMembership();
  public readonly rolePermissions = new RoleIsolationPermissions();
  public readonly assetTaskAssignment = new SharedAssetTaskAssignment();
  public readonly attributionPolicy = new AiAttributionWorkspacePolicy();

  public initEnterpriseTeamWorkspace(
    workspaceName: string,
    category: WorkspaceCategoryType,
    ownerUserId: string
  ): ReturnType<WorkspaceStructureMembership["createWorkspace"]> {
    return this.workspaceMembership.createWorkspace(workspaceName, category, ownerUserId);
  }
}

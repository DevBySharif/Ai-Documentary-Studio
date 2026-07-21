import { UserRole, ActionPermission } from "./security-types";

/**
 * Role-Based Access Control (RBAC) & Central Permission Evaluator (Vol 06 Part 10 - Section 6, Section 7).
 * Evaluates action permissions against role-based matrices (`Administrator`, `Editor`, `Reviewer`, `Viewer`).
 */
export class RoleBasedAuthorizationManager {
  private rolePermissions: Record<UserRole, ActionPermission[]> = {
    Administrator: [
      "CreateProject",
      "EditScript",
      "ApproveStoryboard",
      "DeleteAssets",
      "ExportProject",
      "ModifySettings",
      "InstallPlugins",
    ],
    Editor: [
      "CreateProject",
      "EditScript",
      "ApproveStoryboard",
      "ExportProject",
    ],
    Reviewer: [
      "ApproveStoryboard",
    ],
    Viewer: [],
  };

  public canPerformAction(role: UserRole, action: ActionPermission): boolean {
    const permissions = this.rolePermissions[role] || [];
    return permissions.includes(action);
  }

  public getPermissionsForRole(role: UserRole): ReadonlyArray<ActionPermission> {
    return this.rolePermissions[role] || [];
  }
}

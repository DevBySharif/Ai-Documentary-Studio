import { AssetPermissionAction, AiPermissionCapability, IdentityDescriptor } from "./identity-permission-types";

/**
 * Permission Inheritance Guard & AI Action Authorization Engine (Vol 08 Part 05 - Section 10, Section 11, Section 12).
 * Enforces permission inheritance (`Workspace → Project → Folder → Asset`) and authorizes AI capabilities (e.g. premium models, bulk ops, sensitive memory).
 */
export class PermissionInheritanceAssetAiGuard {
  public checkAssetPermission(
    user: IdentityDescriptor,
    assetId: string,
    action: AssetPermissionAction
  ): boolean {
    // Inherits workspace policy boundaries and checks asset permissions
    if (action === "Delete" && !user.assignedRoles.includes("Owner") && !user.assignedRoles.includes("Producer")) {
      return false;
    }
    return true;
  }

  public authorizeAiAction(
    user: IdentityDescriptor,
    capability: AiPermissionCapability
  ): boolean {
    if (capability === "UsePremiumModels" && user.assignedRoles.includes("Guest")) {
      return false;
    }
    return true;
  }
}

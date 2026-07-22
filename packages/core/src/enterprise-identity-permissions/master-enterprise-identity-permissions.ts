import { IdentityAuthenticationSessionManager } from "./identity-authentication-session-manager";
import { RbacAbacHybridEvaluator } from "./rbac-abac-hybrid-evaluator";
import { PermissionInheritanceAssetAiGuard } from "./permission-inheritance-asset-ai-guard";
import { SecurityAuditPrivilegeEscalator } from "./security-audit-privilege-escalator";
import { IdentityDescriptor, AuthMethodType } from "./identity-permission-types";

/**
 * Master Enterprise Identity Permissions Engine (Main Vol 08 Part 05).
 * Core entry point for 6-stage security pipeline (`Identity → Authentication → Session → Authorization → Permission Evaluation → Resource Access`).
 */
export class MasterEnterpriseIdentityPermissions {
  public readonly sessionManager = new IdentityAuthenticationSessionManager();
  public readonly evaluator = new RbacAbacHybridEvaluator();
  public readonly permissionGuard = new PermissionInheritanceAssetAiGuard();
  public readonly auditEscalator = new SecurityAuditPrivilegeEscalator();

  public authenticateAndAuthorize(
    user: IdentityDescriptor,
    authMethod: AuthMethodType,
    resourceId: string,
    action: string
  ): { isAuthorized: boolean; sessionId: string } {
    this.sessionManager.registerIdentity(user);
    const session = this.sessionManager.createAuthenticatedSession(user.userId, authMethod);

    const isAllowed = this.evaluator.evaluatePermission(user, action, {});
    this.auditEscalator.logSecurityEvent(user.userId, action, resourceId, isAllowed ? "Granted" : "Denied");

    return {
      isAuthorized: isAllowed,
      sessionId: session.sessionId,
    };
  }
}

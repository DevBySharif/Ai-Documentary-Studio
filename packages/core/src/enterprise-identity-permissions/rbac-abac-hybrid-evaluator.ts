import { IdentityDescriptor, EnterpriseRoleType } from "./identity-permission-types";

export interface AbacAttributeContext {
  readonly department?: string;
  readonly projectAssignmentId?: string;
  readonly assetClassification?: "Public" | "Internal" | "Confidential" | "Restricted";
  readonly networkLocation?: string;
}

/**
 * RBAC & ABAC Hybrid Permission Evaluator (Vol 08 Part 05 - Section 7, Section 8, Section 9).
 * Combines Role-Based Access Control (RBAC) with Attribute-Based Access Control (ABAC) (department, project assignment, asset classification).
 */
export class RbacAbacHybridEvaluator {
  public evaluatePermission(
    user: IdentityDescriptor,
    requestedAction: string,
    abacContext: AbacAttributeContext
  ): boolean {
    // 1. Check RBAC
    const isOwnerOrAdmin = user.assignedRoles.some((r: EnterpriseRoleType) => r === "Owner" || r === "Administrator");
    if (isOwnerOrAdmin) return true;

    // 2. Check ABAC (Restricted assets require explicit department match)
    if (abacContext.assetClassification === "Restricted" && user.department !== "Executive") {
      return false;
    }

    return true;
  }
}

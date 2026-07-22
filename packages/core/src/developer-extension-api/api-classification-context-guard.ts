import { ApiClassificationLevel, ExtensionExecutionContext } from "./developer-api-types";

/**
 * API Classification Access Guard & Extension Context Provider (Vol 10 Part 02 - Section 6, Section 7).
 * Enforces classification boundaries (`Public`, `Partner`, `Internal`) and provides read-only execution contexts to extensions.
 */
export class ApiClassificationContextGuard {
  public validateApiAccess(clientRole: "ExternalDeveloper" | "EcosystemPartner" | "CoreEngine", classification: ApiClassificationLevel): boolean {
    if (classification === "Internal") {
      return clientRole === "CoreEngine";
    }
    if (classification === "Partner") {
      return clientRole === "EcosystemPartner" || clientRole === "CoreEngine";
    }
    return true; // Public APIs open to all
  }

  public createExecutionContext(workspaceId: string, userId: string, activeProjectId?: string): ExtensionExecutionContext {
    return {
      workspaceId,
      activeProjectId,
      userId,
      permissions: ["project:read", "asset:create"],
      configJson: JSON.stringify({ theme: "dark" }),
    };
  }
}

import { WorkspaceCategoryType, WorkspaceMember, ProductionRoleType } from "./collaboration-types";

export interface WorkspaceDescriptor {
  readonly workspaceId: string;
  readonly workspaceName: string;
  readonly category: WorkspaceCategoryType;
  readonly ownerId: string;
  readonly members: ReadonlyArray<WorkspaceMember>;
  readonly storageQuotaBytes: number;
  readonly createdAt: Date;
}

/**
 * Workspace & Team Member Management Engine (Vol 08 Part 01 - Section 4, Section 5, Section 7, Section 8).
 * Manages high-level workspaces (`Personal`, `Team`, `Organization`, `Enterprise`, `Educational`) and team memberships.
 */
export class WorkspaceStructureMembership {
  private workspaces = new Map<string, WorkspaceDescriptor>();

  public createWorkspace(
    workspaceName: string,
    category: WorkspaceCategoryType,
    ownerUserId: string
  ): WorkspaceDescriptor {
    const ownerMember: WorkspaceMember = {
      memberId: `mem_owner_${Math.random().toString(36).substring(2, 7)}`,
      userId: ownerUserId,
      displayName: "Workspace Owner",
      role: "Administrator",
      status: "Active",
      joinedAt: new Date(),
    };

    const ws: WorkspaceDescriptor = {
      workspaceId: `ws_${Math.random().toString(36).substring(2, 7)}`,
      workspaceName,
      category,
      ownerId: ownerUserId,
      members: [ownerMember],
      storageQuotaBytes: category === "Enterprise" ? 1099511627776 : 107374182400, // 1 TB vs 100 GB
      createdAt: new Date(),
    };

    this.workspaces.set(ws.workspaceId, ws);
    return ws;
  }

  public addMemberToWorkspace(workspaceId: string, userId: string, displayName: string, role: ProductionRoleType): WorkspaceMember | undefined {
    const ws = this.workspaces.get(workspaceId);
    if (!ws) return undefined;

    const newMember: WorkspaceMember = {
      memberId: `mem_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      displayName,
      role,
      status: "Active",
      joinedAt: new Date(),
    };

    const updated: WorkspaceDescriptor = {
      ...ws,
      members: [...ws.members, newMember],
    };
    this.workspaces.set(workspaceId, updated);
    return newMember;
  }
}

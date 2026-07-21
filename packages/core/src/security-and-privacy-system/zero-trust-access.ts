import { ProjectPermissions } from './project-permissions';
import { PermissionLevel } from './types';

export class ZeroTrustAccess {
  constructor(private permissions: ProjectPermissions) {}

  async enforceAccess(userId: string, resourceId: string, requiredLevel: PermissionLevel, action: () => Promise<any>): Promise<any> {
    // 1. Never trust by default
    // 2. Verify request
    const hasAccess = this.permissions.hasPermission(userId, requiredLevel);
    
    if (!hasAccess) {
      throw new Error(`Zero Trust Access Denied: User ${userId} lacks ${requiredLevel} permission for resource ${resourceId}`);
    }

    // 3. Grant minimum required access and execute
    return await action();
  }
}

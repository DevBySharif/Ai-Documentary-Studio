import { PermissionLevel } from './types';

export class ProjectPermissions {
  private userRoles: Map<string, PermissionLevel> = new Map();

  // In a local desktop app, the default is Admin for the local user.
  // This is built for future collaboration features.
  constructor() {
    this.userRoles.set('local_user', 'Admin');
  }

  hasPermission(userId: string, requiredLevel: PermissionLevel): boolean {
    const userLevel = this.userRoles.get(userId) || 'Read';
    
    const hierarchy: PermissionLevel[] = ["Read", "Edit", "Render", "Export", "Delete", "Admin"];
    
    const requiredIdx = hierarchy.indexOf(requiredLevel);
    const userIdx = hierarchy.indexOf(userLevel);

    return userIdx >= requiredIdx;
  }

  grantRole(userId: string, level: PermissionLevel): void {
    this.userRoles.set(userId, level);
  }
}

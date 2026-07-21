export class WMProjectArchiving {
  private archived: Set<string> = new Set();

  archive(projectId: string): boolean {
    if (this.archived.has(projectId)) return false;
    this.archived.add(projectId);
    return true;
  }

  unarchive(projectId: string): boolean {
    return this.archived.delete(projectId);
  }

  isArchived(projectId: string): boolean {
    return this.archived.has(projectId);
  }

  getArchived(): string[] {
    return Array.from(this.archived);
  }

  getArchivePath(projectId: string): string {
    return `/workspace/Archives/${projectId}`;
  }
}

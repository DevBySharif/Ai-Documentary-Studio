export class WMMultiProjectSupport {
  private openProjects: Set<string> = new Set();
  private maxOpen = 10;

  open(projectId: string): boolean {
    if (this.openProjects.size >= this.maxOpen) return false;
    this.openProjects.add(projectId);
    return true;
  }

  close(projectId: string): void {
    this.openProjects.delete(projectId);
  }

  getOpenProjects(): string[] {
    return Array.from(this.openProjects);
  }

  isOpen(projectId: string): boolean {
    return this.openProjects.has(projectId);
  }

  switchTo(projectId: string): string | null {
    if (!this.isOpen(projectId)) return null;
    return projectId;
  }

  getOpenCount(): number {
    return this.openProjects.size;
  }
}

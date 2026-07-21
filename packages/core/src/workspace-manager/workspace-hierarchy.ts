export class WMWorkspaceHierarchy {
  private readonly structure: string[] = [
    "Channels", "Projects", "Assets", "Templates",
    "Cache", "Exports", "Archives", "Logs", "Settings"
  ];

  getStructure(): string[] {
    return [...this.structure];
  }

  getPath(component: string): string {
    return `/workspace/${component}`;
  }

  validate(paths: string[]): boolean {
    return this.structure.every((s) => paths.includes(s));
  }
}

export class DAFileOrganization {
  private readonly structure: string[] = [
    "UI", "Core", "AI", "Production", "Rendering",
    "Storage", "Plugins", "Settings", "Logs", "Cache"
  ];

  getStructure(): string[] {
    return [...this.structure];
  }

  getPath(component: string): string {
    return `/app/${component}`;
  }

  validateStructure(paths: string[]): boolean {
    return this.structure.every((s) => paths.includes(s));
  }
}

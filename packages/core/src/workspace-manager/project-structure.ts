export class WMProjectStructure {
  private readonly components: string[] = [
    "Script", "Prompts", "Images", "Voice", "Timeline",
    "Motion", "Effects", "QA", "Export", "Metadata"
  ];

  getComponents(): string[] {
    return [...this.components];
  }

  isComplete(paths: string[]): boolean {
    return this.components.every((c) => paths.includes(c));
  }
}

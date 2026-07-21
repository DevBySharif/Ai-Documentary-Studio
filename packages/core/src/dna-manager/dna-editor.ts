export class DNAEditor {
  private editableSections: string[] = [
    "Identity", "Script", "Prompt", "Style", "Motion",
    "Voice", "Subtitle", "QA", "Export"
  ];

  getEditableSections(): string[] {
    return [...this.editableSections];
  }

  isEditable(section: string): boolean {
    return this.editableSections.includes(section);
  }
}

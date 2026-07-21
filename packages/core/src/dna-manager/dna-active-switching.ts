export class DNAActiveSwitching {
  private activeDNA: Map<string, string> = new Map();

  setActive(projectId: string, dnaId: string): void {
    this.activeDNA.set(projectId, dnaId);
  }

  getActive(projectId: string): string | undefined {
    return this.activeDNA.get(projectId);
  }

  switchTo(projectId: string, dnaId: string): string {
    this.activeDNA.set(projectId, dnaId);
    return dnaId;
  }

  remove(projectId: string): void {
    this.activeDNA.delete(projectId);
  }
}

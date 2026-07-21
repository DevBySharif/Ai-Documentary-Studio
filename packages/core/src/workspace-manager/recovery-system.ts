export class WMRecoverySystem {
  private lastAutosave: Map<string, number> = new Map();
  private renderProgress: Map<string, number> = new Map();

  recordAutosave(projectId: string): void {
    this.lastAutosave.set(projectId, Date.now());
  }

  recordRenderProgress(projectId: string, frame: number): void {
    this.renderProgress.set(projectId, frame);
  }

  getLastAutosave(projectId: string): number | undefined {
    return this.lastAutosave.get(projectId);
  }

  getRenderProgress(projectId: string): number | undefined {
    return this.renderProgress.get(projectId);
  }

  recover(projectId: string): { autosave: boolean; renderProgress: boolean } {
    return {
      autosave: this.lastAutosave.has(projectId),
      renderProgress: this.renderProgress.has(projectId)
    };
  }

  clear(projectId: string): void {
    this.lastAutosave.delete(projectId);
    this.renderProgress.delete(projectId);
  }
}

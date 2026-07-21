export class DACommunicationModel {
  private history: Array<{ type: string; source: string; data: Record<string, unknown>; timestamp: number }> = [];

  emit(type: string, source: string, data: Record<string, unknown>): void {
    this.history.push({ type, source, data, timestamp: Date.now() });
  }

  projectOpened(projectId: string): void {
    this.emit("ProjectOpened", "workspace", { projectId });
  }

  sceneGenerated(sceneId: string): void {
    this.emit("SceneGenerated", "production", { sceneId });
  }

  voiceCompleted(voiceId: string): void {
    this.emit("VoiceCompleted", "ai", { voiceId });
  }

  renderStarted(renderId: string): void {
    this.emit("RenderStarted", "rendering", { renderId });
  }

  renderFinished(renderId: string): void {
    this.emit("RenderFinished", "rendering", { renderId });
  }

  exportCompleted(exportId: string): void {
    this.emit("ExportCompleted", "export", { exportId });
  }

  getHistory(): Array<{ type: string; source: string; data: Record<string, unknown>; timestamp: number }> {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}

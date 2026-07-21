import type { MPEventMessage } from "./types.js";

export class MPEngineCommunication {
  private history: MPEventMessage[] = [];

  send(type: string, source: string, target: string, data: Record<string, unknown>): MPEventMessage {
    const msg: MPEventMessage = { type, source, target, data, timestamp: Date.now() };
    this.history.push(msg);
    return msg;
  }

  sceneApproved(sceneId: string): void {
    this.send("SceneApproved", "scene_approval", "timeline", { sceneId });
  }

  timelineBuilt(timelineId: string): void {
    this.send("TimelineBuilt", "timeline", "motion", { timelineId });
  }

  motionReady(motionId: string): void {
    this.send("MotionReady", "motion", "effects", { motionId });
  }

  effectsReady(effectsId: string): void {
    this.send("EffectsReady", "effects", "renderer", { effectsId });
  }

  renderReady(renderId: string): void {
    this.send("RenderReady", "renderer", "qa", { renderId });
  }

  exportReady(exportId: string): void {
    this.send("ExportReady", "qa", "export", { exportId });
  }

  getHistory(): MPEventMessage[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}

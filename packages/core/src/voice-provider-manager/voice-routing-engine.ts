import { VPProviderName } from "./types";

export type VPTaskType = "draft" | "production" | "premium" | "offline" | "custom";

export class VPVoiceRoutingEngine {
  private routes: Map<VPTaskType, VPProviderName> = new Map();
  private defaultRoutes: Map<VPTaskType, VPProviderName> = new Map();

  constructor() {
    this.defaultRoutes.set("draft", "edge_tts");
    this.defaultRoutes.set("production", "kokoro");
    this.defaultRoutes.set("premium", "elevenlabs");
    this.defaultRoutes.set("offline", "piper");
    this.defaultRoutes.set("custom", "edge_tts");

    for (const [task, provider] of this.defaultRoutes) {
      this.routes.set(task, provider);
    }
  }

  setRoute(task: VPTaskType, provider: VPProviderName): void {
    this.routes.set(task, provider);
  }

  getRoute(task: VPTaskType): VPProviderName | undefined {
    return this.routes.get(task);
  }

  getDefaultRoute(task: VPTaskType): VPProviderName | undefined {
    return this.defaultRoutes.get(task);
  }

  getAllRoutes(): Map<VPTaskType, VPProviderName> {
    return new Map(this.routes);
  }

  resetToDefaults(): void {
    this.routes.clear();
    for (const [task, provider] of this.defaultRoutes) {
      this.routes.set(task, provider);
    }
  }

  resolveProvider(task: VPTaskType, preferred?: VPProviderName): VPProviderName {
    if (preferred && this.routes.has(task)) {
      return preferred;
    }
    return this.routes.get(task) || this.defaultRoutes.get(task) || "edge_tts";
  }
}

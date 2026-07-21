import { EngineLifecycleStage } from "./dependency-types";

/**
 * Engine Lifecycle Orchestrator (Vol 06 Part 02 - Section 12).
 * Drives engine lifecycle progression (`Initialize → LoadConfiguration → RegisterEvents → Ready → Processing → Idle → Shutdown`).
 */
export class EngineLifecycleOrchestrator {
  private engineStates = new Map<string, EngineLifecycleStage>();

  public transitionEngineState(engineName: string, targetStage: EngineLifecycleStage): EngineLifecycleStage {
    const allowedTransitions: Record<EngineLifecycleStage, EngineLifecycleStage[]> = {
      Initialize: ["LoadConfiguration"],
      LoadConfiguration: ["RegisterEvents"],
      RegisterEvents: ["Ready"],
      Ready: ["Processing", "Idle", "Shutdown"],
      Processing: ["Idle", "Shutdown"],
      Idle: ["Processing", "Shutdown"],
      Shutdown: [],
    };

    const current = this.engineStates.get(engineName) || "Initialize";
    if (allowedTransitions[current]?.includes(targetStage)) {
      this.engineStates.set(engineName, targetStage);
      return targetStage;
    }
    return current;
  }

  public getEngineState(engineName: string): EngineLifecycleStage {
    return this.engineStates.get(engineName) || "Initialize";
  }
}

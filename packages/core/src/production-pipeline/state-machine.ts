import type { ProductionState } from "./types.js";

export class ProductionStateMachine {
  private state: ProductionState = "ready";
  private history: Array<{ from: ProductionState; to: ProductionState; timestamp: string }> = [];
  private recoverable = true;

  getState(): ProductionState {
    return this.state;
  }

  canTransition(target: ProductionState): boolean {
    const valid: Record<ProductionState, ProductionState[]> = {
      ready: ["building"],
      building: ["rendering", "failed"],
      rendering: ["validating", "failed"],
      validating: ["encoding", "failed"],
      encoding: ["completed", "failed"],
      completed: ["archived"],
      archived: [],
      failed: ["ready", "building"]
    };
    return (valid[this.state] ?? []).includes(target);
  }

  transition(target: ProductionState): boolean {
    if (!this.canTransition(target)) return false;
    this.history.push({ from: this.state, to: target, timestamp: new Date().toISOString() });
    this.state = target;
    return true;
  }

  markFailed(): void {
    this.transition("failed");
  }

  reset(): void {
    this.state = "ready";
  }

  getHistory(): Array<{ from: ProductionState; to: ProductionState; timestamp: string }> {
    return [...this.history];
  }

  isRecoverable(): boolean {
    return this.recoverable;
  }

  setRecoverable(v: boolean): void {
    this.recoverable = v;
  }
}

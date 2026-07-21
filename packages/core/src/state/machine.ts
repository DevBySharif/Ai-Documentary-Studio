import {
  PROJECT_STATES,
  PROJECT_STATE_TRANSITIONS,
  type ProjectState,
  type ProjectStateChange,
} from "../types/project.js";
import { EventBus } from "../event-bus/index.js";

export class ProjectStateMachine {
  private states = new Map<string, ProjectState>();
  private history = new Map<string, ProjectStateChange[]>();
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  getState(projectId: string): ProjectState {
    return this.states.get(projectId) ?? "created";
  }

  getHistory(projectId: string): ProjectStateChange[] {
    return this.history.get(projectId) ?? [];
  }

  isValidTransition(from: ProjectState, to: ProjectState): boolean {
    const allowed = PROJECT_STATE_TRANSITIONS[from];
    return allowed?.includes(to) ?? false;
  }

  async transition(projectId: string, to: ProjectState, reason?: string): Promise<boolean> {
    const from = this.getState(projectId);

    if (from === to) return true;

    if (!this.isValidTransition(from, to)) {
      await this.eventBus.emit("state:invalid", {
        projectId,
        from,
        to,
        timestamp: new Date().toISOString(),
      });
      return false;
    }

    const change: ProjectStateChange = {
      projectId,
      from,
      to,
      timestamp: new Date().toISOString(),
      reason,
    };

    this.states.set(projectId, to);

    if (!this.history.has(projectId)) {
      this.history.set(projectId, []);
    }
    this.history.get(projectId)!.push(change);

    await this.eventBus.emit("state:changed", change as unknown as Record<string, unknown>);

    return true;
  }

  async reset(projectId: string, to: ProjectState = "created"): Promise<void> {
    this.states.set(projectId, to);
  }
}

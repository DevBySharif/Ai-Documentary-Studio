export type WorkflowEventType =
  | "WorkflowStarted"
  | "TaskReady"
  | "TaskStarted"
  | "TaskCompleted"
  | "ApprovalRequested"
  | "WorkflowPaused"
  | "WorkflowResumed"
  | "WorkflowCompleted";

export interface WorkflowEvent {
  readonly eventId: string;
  readonly workflowId: string;
  readonly type: WorkflowEventType;
  readonly taskId?: string;
  readonly timestamp: Date;
  readonly details?: Record<string, unknown>;
}

export interface DecisionLogEntry {
  readonly decisionId: string;
  readonly workflowId: string;
  readonly taskId: string;
  readonly responsibleComponent: string;
  readonly outcome: string;
  readonly confidenceScore: number;
  readonly timestamp: Date;
}

/**
 * Decision Logger & Event System (IB Part 20 - Section 14, Section 17, Section 18).
 */
export class DecisionLogger {
  private events: WorkflowEvent[] = [];
  private decisions: DecisionLogEntry[] = [];

  public logEvent(workflowId: string, type: WorkflowEventType, taskId?: string, details?: Record<string, unknown>): WorkflowEvent {
    const event: WorkflowEvent = {
      eventId: `evt_${Math.random().toString(36).substring(2, 9)}`,
      workflowId,
      type,
      taskId,
      timestamp: new Date(),
      details,
    };
    this.events.push(event);
    return event;
  }

  public logDecision(workflowId: string, taskId: string, component: string, outcome: string, confidence = 1.0): DecisionLogEntry {
    const entry: DecisionLogEntry = {
      decisionId: `dec_${Math.random().toString(36).substring(2, 9)}`,
      workflowId,
      taskId,
      responsibleComponent: component,
      outcome,
      confidenceScore: confidence,
      timestamp: new Date(),
    };
    this.decisions.push(entry);
    return entry;
  }

  public getEvents(workflowId: string): ReadonlyArray<WorkflowEvent> {
    return this.events.filter((e) => e.workflowId === workflowId);
  }

  public getDecisions(workflowId: string): ReadonlyArray<DecisionLogEntry> {
    return this.decisions.filter((d) => d.workflowId === workflowId);
  }
}

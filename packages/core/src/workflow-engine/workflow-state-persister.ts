import { TaskGraph, WorkflowTask } from "./task-graph";
import { ProductionGoal } from "./goal-model";

export interface PersistedWorkflowSnapshot {
  readonly workflowId: string;
  readonly goal: ProductionGoal;
  readonly templateName: string;
  readonly version: number;
  readonly tasks: ReadonlyArray<WorkflowTask>;
  readonly savedAt: Date;
}

/**
 * Workflow State Persister & Recovery Engine (IB Part 20 - Section 13, Section 21).
 * Restores workflow state and task graphs without re-executing completed tasks.
 */
export class WorkflowStatePersister {
  private snapshots = new Map<string, PersistedWorkflowSnapshot>();

  public saveSnapshot(
    workflowId: string,
    goal: ProductionGoal,
    templateName: string,
    version: number,
    graph: TaskGraph
  ): PersistedWorkflowSnapshot {
    const snapshot: PersistedWorkflowSnapshot = {
      workflowId,
      goal,
      templateName,
      version,
      tasks: graph.getAllTasks(),
      savedAt: new Date(),
    };
    this.snapshots.set(workflowId, snapshot);
    return snapshot;
  }

  public restoreSnapshot(workflowId: string, graph: TaskGraph): PersistedWorkflowSnapshot | undefined {
    const snapshot = this.snapshots.get(workflowId);
    if (!snapshot) return undefined;

    // Restore task states onto graph
    for (const taskState of snapshot.tasks) {
      const existing = graph.getTask(taskState.taskId);
      if (existing) {
        existing.state = taskState.state;
        existing.result = taskState.result;
        existing.error = taskState.error;
      }
    }

    return snapshot;
  }
}

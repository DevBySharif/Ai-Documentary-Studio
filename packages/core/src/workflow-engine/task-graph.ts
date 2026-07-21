export type TaskState =
  | "Pending"
  | "Ready"
  | "Running"
  | "Waiting"
  | "Blocked"
  | "Completed"
  | "Failed"
  | "Cancelled";

export interface TaskRetryPolicy {
  readonly maxRetries: number;
  readonly retryCount: number;
  readonly backoffMs: number;
}

export interface WorkflowTask {
  readonly taskId: string;
  readonly taskType: string;
  readonly title: string;
  readonly responsibleAgent: string;
  readonly dependencies: ReadonlyArray<string>; // taskIds
  readonly requiredInputs: ReadonlyArray<string>;
  readonly expectedOutputs: ReadonlyArray<string>;
  state: TaskState;
  readonly retryPolicy: TaskRetryPolicy;
  readonly requiresApproval: boolean;
  result?: unknown;
  error?: string;
}

/**
 * Task Graph DAG (IB Part 20 - Section 5, Section 7, Section 8).
 * Manages dependency resolution and task state transitions.
 */
export class TaskGraph {
  private tasks = new Map<string, WorkflowTask>();

  public addTask(task: WorkflowTask): void {
    this.tasks.set(task.taskId, task);
  }

  public getTask(taskId: string): WorkflowTask | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): ReadonlyArray<WorkflowTask> {
    return Array.from(this.tasks.values());
  }

  /**
   * Automatic Dependency Resolution (Section 8).
   * Evaluates pending tasks and transitions them to 'Ready' if dependencies are met.
   */
  public updateDependencyStates(): void {
    for (const task of Array.from(this.tasks.values())) {
      if (task.state !== "Pending" && task.state !== "Blocked") continue;

      const allDepsCompleted = task.dependencies.every((depId) => {
        const dep = this.tasks.get(depId);
        return dep && dep.state === "Completed";
      });

      if (allDepsCompleted) {
        task.state = "Ready";
      } else {
        task.state = "Blocked";
      }
    }
  }

  public getReadyTasks(): ReadonlyArray<WorkflowTask> {
    this.updateDependencyStates();
    return Array.from(this.tasks.values()).filter((t) => t.state === "Ready");
  }
}

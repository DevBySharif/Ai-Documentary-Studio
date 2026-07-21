export type TaskExecutorFn = (inputs: Record<string, unknown>) => Promise<unknown>;

export interface TaskDescriptor {
  readonly taskType: string;
  readonly description: string;
  readonly defaultAgent: string;
}

/**
 * Extensible Task Registry (IB Part 20 - Section 23).
 * Registers task types and maps them to responsible agents and execution handlers.
 */
export class TaskRegistry {
  private descriptors = new Map<string, TaskDescriptor>();
  private executors = new Map<string, TaskExecutorFn>();

  public registerTask(descriptor: TaskDescriptor, executor: TaskExecutorFn): void {
    this.descriptors.set(descriptor.taskType, descriptor);
    this.executors.set(descriptor.taskType, executor);
  }

  public getDescriptor(taskType: string): TaskDescriptor | undefined {
    return this.descriptors.get(taskType);
  }

  public getExecutor(taskType: string): TaskExecutorFn | undefined {
    return this.executors.get(taskType);
  }
}

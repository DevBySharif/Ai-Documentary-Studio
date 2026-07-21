export interface PrioritizedTask {
  readonly taskId: string;
  readonly title: string;
  readonly priorityScore: number;
  readonly isBlocker: boolean;
  readonly estimatedMinutes: number;
}

/**
 * Production Dashboard Manager & Daily Task Prioritizer (Vol 04 Part 12 - Section 4, Section 5, Section 6).
 * Manages central dashboard metrics and orders daily production tasks by dependency and impact.
 */
export class ProductionDashboardManager {
  public prioritizeTasks(rawTasks: ReadonlyArray<{ taskId: string; title: string; isBlocker: boolean; estMins: number }>): ReadonlyArray<PrioritizedTask> {
    return rawTasks
      .map((t) => ({
        taskId: t.taskId,
        title: t.title,
        priorityScore: t.isBlocker ? 100 : 50,
        isBlocker: t.isBlocker,
        estimatedMinutes: t.estMins,
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }
}

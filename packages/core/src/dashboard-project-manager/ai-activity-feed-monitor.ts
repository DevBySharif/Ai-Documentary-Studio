import { AiActivityTask } from "./dashboard-types";

/**
 * Real-Time AI Activity Feed Monitor (Vol 05 Part 02 - Section 9).
 * Tracks ongoing AI operations (research, image generation, narration rendering, timeline optimization) in real time.
 */
export class AiActivityFeedMonitor {
  private activeTasks: AiActivityTask[] = [
    {
      taskId: "task_img_101",
      title: "Generating B-roll candidate set for Scene 2",
      module: "ImageGeneration",
      progressPercent: 65,
      status: "Running",
      estimatedTimeRemainingSecs: 15,
    },
    {
      taskId: "task_voc_102",
      title: "Synthesizing British Male Narration (David)",
      module: "Voice",
      progressPercent: 100,
      status: "Completed",
      estimatedTimeRemainingSecs: 0,
    },
  ];

  public getActiveTasks(): ReadonlyArray<AiActivityTask> {
    return this.activeTasks;
  }

  public updateTaskProgress(taskId: string, progress: number, status: AiActivityTask["status"]): void {
    const task = this.activeTasks.find((t) => t.taskId === taskId);
    if (task) {
      const idx = this.activeTasks.indexOf(task);
      this.activeTasks[idx] = { ...task, progressPercent: progress, status };
    }
  }
}

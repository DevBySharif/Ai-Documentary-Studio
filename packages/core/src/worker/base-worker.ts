import type { WorkerName, WorkerTask, WorkerResult } from "./types.js";

export abstract class BaseWorker {
  abstract name: WorkerName;

  abstract process(task: WorkerTask): Promise<WorkerResult>;

  async execute(task: WorkerTask): Promise<WorkerResult> {
    const start = Date.now();
    try {
      const result = await this.process(task);
      return { ...result, duration: Date.now() - start };
    } catch (error) {
      return {
        success: false,
        output: {},
        duration: Date.now() - start,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

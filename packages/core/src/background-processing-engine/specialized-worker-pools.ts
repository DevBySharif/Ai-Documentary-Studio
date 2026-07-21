import { WorkerPoolType } from "./job-types";

export interface WorkerInstance {
  readonly workerId: string;
  readonly poolType: WorkerPoolType;
  readonly isBusy: boolean;
}

/**
 * Specialized Worker Pool Manager (Vol 06 Part 07 - Section 8, Section 11, Section 12).
 * Manages separate worker pools (AI, Rendering, Media, Index, Maintenance) to prevent workload starvation.
 */
export class SpecializedWorkerPools {
  private workers: WorkerInstance[] = [
    { workerId: "wrk_ai_1", poolType: "AiWorkers", isBusy: false },
    { workerId: "wrk_rnd_1", poolType: "RenderingWorkers", isBusy: false },
    { workerId: "wrk_med_1", poolType: "MediaWorkers", isBusy: false },
    { workerId: "wrk_idx_1", poolType: "IndexWorkers", isBusy: false },
    { workerId: "wrk_mnt_1", poolType: "MaintenanceWorkers", isBusy: false },
  ];

  public getAvailableWorker(poolType: WorkerPoolType): WorkerInstance | undefined {
    return this.workers.find((w) => w.poolType === poolType && !w.isBusy);
  }

  public listWorkers(): ReadonlyArray<WorkerInstance> {
    return this.workers;
  }
}

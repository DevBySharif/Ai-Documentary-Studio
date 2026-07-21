import { Job, WorkerCategory } from './types';

export interface WorkerInstance {
  id: string;
  category: WorkerCategory;
  isBusy: boolean;
  currentJobId?: string;
  executeJob(job: Job): Promise<any>;
  cancelJob(): Promise<void>;
}

export class WorkerPool {
  private workers: Map<string, WorkerInstance> = new Map();

  registerWorker(worker: WorkerInstance): void {
    this.workers.set(worker.id, worker);
  }

  unregisterWorker(workerId: string): void {
    this.workers.delete(workerId);
  }

  getAvailableWorker(category: WorkerCategory): WorkerInstance | undefined {
    for (const worker of this.workers.values()) {
      if (worker.category === category && !worker.isBusy) {
        return worker;
      }
    }
    return undefined;
  }

  getWorkerByJobId(jobId: string): WorkerInstance | undefined {
    for (const worker of this.workers.values()) {
      if (worker.currentJobId === jobId) {
        return worker;
      }
    }
    return undefined;
  }

  getAllWorkers(): WorkerInstance[] {
    return Array.from(this.workers.values());
  }

  getUtilization(category?: WorkerCategory): number {
    let total = 0;
    let busy = 0;
    for (const worker of this.workers.values()) {
      if (!category || worker.category === category) {
        total++;
        if (worker.isBusy) busy++;
      }
    }
    return total === 0 ? 0 : busy / total;
  }

  async executeOnWorker(workerId: string, job: Job): Promise<any> {
    const worker = this.workers.get(workerId);
    if (!worker) throw new Error(`Worker ${workerId} not found`);
    if (worker.isBusy) throw new Error(`Worker ${workerId} is busy`);

    worker.isBusy = true;
    worker.currentJobId = job.id;

    try {
      const result = await worker.executeJob(job);
      return result;
    } finally {
      worker.isBusy = false;
      worker.currentJobId = undefined;
    }
  }

  async cancelJobExecution(jobId: string): Promise<void> {
    const worker = this.getWorkerByJobId(jobId);
    if (worker) {
      await worker.cancelJob();
    }
  }
}

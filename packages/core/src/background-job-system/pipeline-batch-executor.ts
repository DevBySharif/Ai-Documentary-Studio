import { BatchPipeline, Job } from './types';
import { JobManager } from './job-manager';

export class PipelineBatchExecutor {
  private batches: Map<string, BatchPipeline> = new Map();

  constructor(private jobManager: JobManager) {}

  createBatch(name: string, jobs: Job[]): BatchPipeline {
    const batch: BatchPipeline = {
      batchId: `batch_${Date.now()}`,
      name,
      jobs,
      status: "Paused",
      progress: 0
    };
    this.batches.set(batch.batchId, batch);
    return batch;
  }

  startBatch(batchId: string): void {
    const batch = this.batches.get(batchId);
    if (!batch) return;

    batch.status = "Running";
    for (const job of batch.jobs) {
      // Re-register jobs in the job manager
      // In a full implementation, you'd integrate tighter with JobManager enqueue mechanism
      this.jobManager.resumeJob(job.id); 
    }
  }

  pauseBatch(batchId: string): void {
    const batch = this.batches.get(batchId);
    if (!batch) return;
    
    batch.status = "Paused";
    for (const job of batch.jobs) {
      this.jobManager.pauseJob(job.id);
    }
  }

  updateBatchProgress(batchId: string): void {
    const batch = this.batches.get(batchId);
    if (!batch) return;

    const totalJobs = batch.jobs.length;
    if (totalJobs === 0) {
      batch.progress = 100;
      batch.status = "Completed";
      return;
    }

    let completed = 0;
    for (const job of batch.jobs) {
      if (job.state === 'Completed') completed++;
      if (job.state === 'Failed') {
        batch.status = "Failed";
        return;
      }
    }

    batch.progress = Math.round((completed / totalJobs) * 100);
    if (batch.progress === 100) {
      batch.status = "Completed";
    }
  }
}

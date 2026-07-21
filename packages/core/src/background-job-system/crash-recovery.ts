import { Job } from './types';

export class CrashRecoveryManager {
  private checkpoints: Map<string, any> = new Map();
  private pendingJobs: Map<string, Job> = new Map();

  // In a real implementation, these would write to a persistent store (SQLite/JSON)
  saveCheckpoint(jobId: string, checkpointData: any): void {
    this.checkpoints.set(jobId, checkpointData);
    this.persistToDisk();
  }

  getCheckpoint(jobId: string): any | undefined {
    return this.checkpoints.get(jobId);
  }

  registerPendingJob(job: Job): void {
    this.pendingJobs.set(job.id, job);
    this.persistToDisk();
  }

  unregisterPendingJob(jobId: string): void {
    this.pendingJobs.delete(jobId);
    this.checkpoints.delete(jobId);
    this.persistToDisk();
  }

  recoverPendingJobs(): Job[] {
    // Load from disk
    this.loadFromDisk();
    
    const recovered: Job[] = [];
    for (const job of this.pendingJobs.values()) {
      // If a job was running, it might have failed midway. Reset to Queued or Paused based on checkpoint
      if (job.state === 'Running') {
        job.state = this.checkpoints.has(job.id) ? 'Paused' : 'Queued';
      }
      recovered.push(job);
    }
    return recovered;
  }

  private persistToDisk(): void {
    // Stub: Serialize this.checkpoints and this.pendingJobs to disk
  }

  private loadFromDisk(): void {
    // Stub: Deserialize from disk
  }
}

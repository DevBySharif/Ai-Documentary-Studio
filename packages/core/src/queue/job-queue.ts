import type { Job, QueueName, QueueMetrics, JobStatus } from "./types.js";

export class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private queueOrder: QueueName[] = ["research", "prompt", "image", "audio", "timeline", "motion", "quality", "render"];
  private durations: Map<QueueName, number[]> = new Map();

  enqueue(job: Omit<Job, "id" | "status" | "progress" | "logs" | "createdAt">): Job {
    const newJob: Job = {
      ...job,
      id: this.generateId(),
      status: "queued",
      progress: 0,
      logs: [],
      createdAt: new Date().toISOString(),
    };
    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  dequeue(queue?: QueueName): Job | undefined {
    for (const q of this.queueOrder) {
      if (queue && q !== queue) continue;
      const pending = this.getByStatus("queued", q).sort((a, b) => b.priority - a.priority);
      if (pending.length > 0) {
        const job = pending[0];
        job.status = "running";
        job.startedAt = new Date().toISOString();
        return job;
      }
    }
    return undefined;
  }

  complete(id: string, result?: unknown): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "completed";
    job.progress = 100;
    job.completedAt = new Date().toISOString();
    job.result = result;
    this.recordDuration(job.queue, job.createdAt);
  }

  fail(id: string, error: string): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.status = "failed";
    job.error = error;
    job.completedAt = new Date().toISOString();
  }

  retry(id: string): Job | undefined {
    const job = this.jobs.get(id);
    if (!job || job.retryCount >= job.maxRetries) return undefined;
    job.retryCount++;
    job.status = "retrying";
    job.logs.push(`Retry ${job.retryCount}/${job.maxRetries}`);
    const newJob = this.enqueue({
      queue: job.queue,
      priority: job.priority,
      retryCount: job.retryCount,
      maxRetries: job.maxRetries,
      payload: job.payload,
    });
    job.status = "cancelled";
    return newJob;
  }

  updateProgress(id: string, progress: number, log?: string): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.progress = progress;
    if (log) job.logs.push(log);
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getByStatus(status: JobStatus, queue?: QueueName): Job[] {
    return Array.from(this.jobs.values()).filter(
      (j) => j.status === status && (!queue || j.queue === queue)
    );
  }

  getMetrics(): QueueMetrics[] {
    return this.queueOrder.map((queue) => {
      const jobs = Array.from(this.jobs.values()).filter((j) => j.queue === queue);
      const durations = this.durations.get(queue) ?? [];
      const avgDuration = durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0;

      return {
        queue,
        queued: jobs.filter((j) => j.status === "queued" || j.status === "retrying").length,
        running: jobs.filter((j) => j.status === "running").length,
        completed: jobs.filter((j) => j.status === "completed").length,
        failed: jobs.filter((j) => j.status === "failed").length,
        avgDuration,
      };
    });
  }

  clear(): void {
    this.jobs.clear();
    this.durations.clear();
  }

  private generateId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private recordDuration(queue: QueueName, createdAt: string): void {
    const start = new Date(createdAt).getTime();
    const duration = Date.now() - start;
    const existing = this.durations.get(queue) ?? [];
    existing.push(duration);
    this.durations.set(queue, existing.slice(-100));
  }
}

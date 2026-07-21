import { Job } from './types';

export class JobDependencyResolver {
  // job id -> array of dependent job ids (children)
  private adjacencyList: Map<string, string[]> = new Map();
  // job id -> count of unresolved dependencies (parents)
  private inDegree: Map<string, number> = new Map();
  private allJobs: Map<string, Job> = new Map();

  addJob(job: Job): void {
    this.allJobs.set(job.id, job);
    
    if (!this.inDegree.has(job.id)) {
      this.inDegree.set(job.id, 0);
    }
    
    if (!this.adjacencyList.has(job.id)) {
      this.adjacencyList.set(job.id, []);
    }

    for (const dep of job.dependencies) {
      if (!this.adjacencyList.has(dep)) {
        this.adjacencyList.set(dep, []);
      }
      this.adjacencyList.get(dep)!.push(job.id);
      
      const currentInDegree = this.inDegree.get(job.id) || 0;
      this.inDegree.set(job.id, currentInDegree + 1);
    }
  }

  removeJob(jobId: string): void {
    const children = this.adjacencyList.get(jobId) || [];
    for (const childId of children) {
      const childInDegree = this.inDegree.get(childId) || 0;
      if (childInDegree > 0) {
        this.inDegree.set(childId, childInDegree - 1);
      }
    }
    this.adjacencyList.delete(jobId);
    this.inDegree.delete(jobId);
    this.allJobs.delete(jobId);
  }

  isReady(jobId: string): boolean {
    return (this.inDegree.get(jobId) || 0) === 0;
  }

  getReadyJobs(): Job[] {
    const readyJobs: Job[] = [];
    for (const [jobId, count] of this.inDegree.entries()) {
      if (count === 0) {
        const job = this.allJobs.get(jobId);
        if (job) readyJobs.push(job);
      }
    }
    return readyJobs;
  }

  markJobCompleted(jobId: string): string[] {
    const newlyReady: string[] = [];
    const children = this.adjacencyList.get(jobId) || [];
    
    for (const childId of children) {
      const current = this.inDegree.get(childId) || 0;
      if (current > 0) {
        this.inDegree.set(childId, current - 1);
        if (current - 1 === 0) {
          newlyReady.push(childId);
        }
      }
    }
    
    return newlyReady;
  }

  hasCycles(): boolean {
    // Topological sort to detect cycles
    const inDegreeCopy = new Map(this.inDegree);
    const queue: string[] = [];
    let count = 0;

    for (const [jobId, deg] of inDegreeCopy.entries()) {
      if (deg === 0) queue.push(jobId);
    }

    while (queue.length > 0) {
      const u = queue.shift()!;
      count++;

      const children = this.adjacencyList.get(u) || [];
      for (const child of children) {
        const deg = inDegreeCopy.get(child) || 0;
        inDegreeCopy.set(child, deg - 1);
        if (deg - 1 === 0) {
          queue.push(child);
        }
      }
    }

    return count !== this.allJobs.size;
  }
}

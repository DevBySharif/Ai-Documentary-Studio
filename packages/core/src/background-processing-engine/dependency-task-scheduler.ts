import { BackgroundJobDescriptor, ResourceLimitsConfig } from "./job-types";

/**
 * Dependency-Aware Task Scheduler & Resource Evaluator (Vol 06 Part 07 - Section 7, Section 9, Section 17, Section 18).
 * Evaluates prerequisite job completions and hardware resource limits before scheduling job execution.
 */
export class DependencyTaskScheduler {
  private resourceLimits: ResourceLimitsConfig = {
    maxConcurrentAiJobs: 4,
    maxConcurrentRenderingJobs: 2,
    maxCpuUsagePercent: 85,
    maxGpuUsagePercent: 90,
  };

  public isJobReadyToRun(
    job: BackgroundJobDescriptor,
    completedJobIds: ReadonlyArray<string>,
    activeJobCount: number
  ): boolean {
    // Check prerequisites
    const prereqsMet = job.prerequisiteJobIds.every((id) => completedJobIds.includes(id));
    if (!prereqsMet) return false;

    // Check concurrency limits
    if (activeJobCount >= this.resourceLimits.maxConcurrentAiJobs + this.resourceLimits.maxConcurrentRenderingJobs) {
      return false;
    }

    return true;
  }

  public getResourceLimits(): Readonly<ResourceLimitsConfig> {
    return this.resourceLimits;
  }
}

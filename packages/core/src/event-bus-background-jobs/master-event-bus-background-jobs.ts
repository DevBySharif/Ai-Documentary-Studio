import { EventBusMessageBroker } from "./event-bus-message-broker";
import { JobDispatcherPriorityScheduler } from "./job-dispatcher-priority-scheduler";
import { RetryDeadLetterManager } from "./retry-dead-letter-manager";
import { DistributedWorkerPoolProgressTracker } from "./distributed-worker-pool-progress-tracker";
import { BackgroundJobType, JobPriorityLevel } from "./job-event-types";

/**
 * Master Event Bus & Background Jobs Engine (Main Vol 09 Part 03).
 * Core entry point for 6-layer asynchronous architecture (`Client → API Gateway → Job Dispatcher → Message Broker → Workers → Completed Results`).
 */
export class MasterEventBusBackgroundJobs {
  public readonly eventBus = new EventBusMessageBroker();
  public readonly dispatcher = new JobDispatcherPriorityScheduler();
  public readonly retryDlqManager = new RetryDeadLetterManager();
  public readonly workerTracker = new DistributedWorkerPoolProgressTracker();

  public submitBackgroundJob(
    jobType: BackgroundJobType,
    payloadObj: unknown,
    priority: JobPriorityLevel = "Normal"
  ): ReturnType<JobDispatcherPriorityScheduler["dispatchJob"]> {
    const job = this.dispatcher.dispatchJob(jobType, payloadObj, priority);
    this.eventBus.publishEvent(`${jobType}Submitted`, "JobDispatcher", { jobId: job.jobId });
    return job;
  }
}

import { JobManager } from './job-manager';
import { DistributedJobScheduler } from './distributed-scheduler';
import { GPUTaskManager } from './gpu-task-manager';
import { AdaptiveResourceManager } from './adaptive-resource-manager';
import { PipelineBatchExecutor } from './pipeline-batch-executor';
import { JobDashboard } from './job-dashboard';
import { OutputContractBuilder } from './output-contract';
import { WorkerPool } from './worker-pool';

export class BackgroundJobSystem {
  public readonly jobManager: JobManager;
  public readonly workerPool: WorkerPool;
  public readonly distributedScheduler: DistributedJobScheduler;
  public readonly gpuTaskManager: GPUTaskManager;
  public readonly adaptiveResource: AdaptiveResourceManager;
  public readonly batchExecutor: PipelineBatchExecutor;
  public readonly dashboard: JobDashboard;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.jobManager = new JobManager();
    // Worker pool is internal to JobManager, but we expose it or use the same instance
    // For architectural completeness, JobManager internally manages its WorkerPool
    // We can extract it if we want it shared
    this.workerPool = (this.jobManager as any).workerPool as WorkerPool;
    
    this.distributedScheduler = new DistributedJobScheduler();
    this.gpuTaskManager = new GPUTaskManager();
    this.adaptiveResource = new AdaptiveResourceManager();
    this.batchExecutor = new PipelineBatchExecutor(this.jobManager);
    this.dashboard = new JobDashboard(this.jobManager, this.workerPool, this.adaptiveResource);
    this.contractBuilder = new OutputContractBuilder();
  }

  start(): void {
    this.jobManager.startProcessing();
  }

  stop(): void {
    this.jobManager.stopProcessing();
  }
}

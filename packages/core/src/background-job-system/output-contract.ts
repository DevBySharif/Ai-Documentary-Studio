import { Job, JobOutputContract } from './types';

export class OutputContractBuilder {
  buildContract(job: Job): JobOutputContract {
    return {
      jobId: job.id,
      type: job.type,
      status: job.state,
      progress: job.progress,
      worker: job.workerId
    };
  }
  
  toJSON(contract: JobOutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

import { OutputContract } from './types';

export class OutputContractBuilder {
  buildContract(
    cpuUsagePct: number, 
    gpuUsagePct: number, 
    jobs: number, 
    renderQueue: number, 
    alerts: number, 
    status: string
  ): OutputContract {
    return {
      cpu: Math.round(cpuUsagePct),
      gpu: Math.round(gpuUsagePct),
      jobs,
      renderQueue,
      alerts,
      status
    };
  }

  toJSON(contract: OutputContract): string {
    return JSON.stringify(contract, null, 2);
  }
}

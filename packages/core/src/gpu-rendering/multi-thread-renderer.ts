export class GRMultiThreadRenderer {
  private cpuTasks: string[] = [];
  private gpuTasks: string[] = [];

  constructor() {
    this.cpuTasks = ["Timeline Processing", "Scheduling", "Audio Processing"];
    this.gpuTasks = ["Motion Rendering", "Effects Compositing", "Frame Encoding"];
  }

  assignCPUTask(task: string): void {
    this.cpuTasks.push(task);
  }

  assignGPUTask(task: string): void {
    this.gpuTasks.push(task);
  }

  getCPUTasks(): string[] {
    return [...this.cpuTasks];
  }

  getGPUTasks(): string[] {
    return [...this.gpuTasks];
  }

  isBalanced(): boolean {
    return Math.abs(this.cpuTasks.length - this.gpuTasks.length) <= 2;
  }

  recommendParallelism(): number {
    return navigator.hardwareConcurrency ?? 4;
  }

  reset(): void {
    this.cpuTasks = ["Timeline Processing", "Scheduling", "Audio Processing"];
    this.gpuTasks = ["Motion Rendering", "Effects Compositing", "Frame Encoding"];
  }
}

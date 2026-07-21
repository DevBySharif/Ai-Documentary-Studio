import type { PDResourceUsage, PDResourceType } from "./types.js";

export class PDResourceManager {
  private usage: PDResourceUsage = { cpu: 0, gpu: 0, ram: 0, disk: 0, network: 0 };

  monitor(): PDResourceUsage {
    return { ...this.usage };
  }

  update(type: PDResourceType, value: number): void {
    this.usage[type] = value;
  }

  isAvailable(type: PDResourceType, required: number): boolean {
    return this.usage[type] + required <= 100;
  }

  allocate(type: PDResourceType, amount: number): boolean {
    if (!this.isAvailable(type, amount)) return false;
    this.usage[type] += amount;
    return true;
  }

  free(type: PDResourceType, amount: number): void {
    this.usage[type] = Math.max(0, this.usage[type] - amount);
  }

  getAvailableCPU(): number {
    return 100 - this.usage.cpu;
  }

  getAvailableGPU(): number {
    return 100 - this.usage.gpu;
  }

  getAvailableRAM(): number {
    return 100 - this.usage.ram;
  }
}

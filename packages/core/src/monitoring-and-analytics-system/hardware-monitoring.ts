import { TelemetryCollector } from './telemetry-collector';
import { AlertSystem } from './alert-system';

export class HardwareMonitoring {
  private readonly CPU_TEMP_WARNING = 85; // C
  private readonly GPU_TEMP_WARNING = 80; // C
  private readonly MEMORY_PRESSURE_WARNING = 90; // %

  constructor(private telemetry: TelemetryCollector, private alertSystem: AlertSystem) {
    this.telemetry.subscribe((metrics) => this.analyzeHardware(metrics));
  }

  private analyzeHardware(metrics: any): void {
    // Simulated temperature analysis (if available)
    if (metrics.cpuTempC && metrics.cpuTempC > this.CPU_TEMP_WARNING) {
      this.alertSystem.dispatchAlert("Warning", `CPU Temperature high: ${metrics.cpuTempC}C`, "Hardware");
    }

    if (metrics.gpuTempC && metrics.gpuTempC > this.GPU_TEMP_WARNING) {
      this.alertSystem.dispatchAlert("Warning", `GPU Temperature high: ${metrics.gpuTempC}C`, "Hardware");
    }

    // Memory pressure logic mock
    if (metrics.ramUsageMB > 32000) { // e.g. near 32GB
       this.alertSystem.dispatchAlert("Warning", `High Memory Pressure detected.`, "Hardware");
    }
  }
}

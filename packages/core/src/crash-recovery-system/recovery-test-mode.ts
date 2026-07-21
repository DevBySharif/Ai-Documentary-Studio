import { CrashDetector } from './crash-detector';

export class RecoveryTestMode {
  constructor(private crashDetector: CrashDetector) {}

  simulateAppCrash(): never {
    console.warn("SIMULATING APP CRASH...");
    this.crashDetector.simulateCrash("ApplicationCrash");
    // Hard exit to test recovery loop in development
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    throw new Error("Simulated Crash");
  }

  simulatePowerLoss(): void {
    console.warn("SIMULATING POWER LOSS...");
    this.crashDetector.simulateCrash("PowerFailure");
  }

  simulateDatabaseCorruption(): void {
    console.warn("SIMULATING DB CORRUPTION...");
    this.crashDetector.simulateCrash("DatabaseCorruption");
  }

  simulateGPUFailure(): void {
    console.warn("SIMULATING GPU FAILURE...");
    this.crashDetector.simulateCrash("GPUDriverCrash");
  }
}

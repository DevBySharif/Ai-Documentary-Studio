import { ReleaseGate } from './types';

export class ReleaseGateSystem {
  private currentGate: ReleaseGate = "Development";
  private gates: ReleaseGate[] = [
    "Development", "Testing", "QA", "Security", 
    "Performance", "Certification", "Production"
  ];

  getCurrentGate(): ReleaseGate {
    return this.currentGate;
  }

  advanceGate(): boolean {
    const currentIndex = this.gates.indexOf(this.currentGate);
    if (currentIndex < this.gates.length - 1) {
      this.currentGate = this.gates[currentIndex + 1];
      console.log(`[RELEASE GATE] Advanced to: ${this.currentGate}`);
      return true;
    }
    console.log(`[RELEASE GATE] Already at final gate: ${this.currentGate}`);
    return false;
  }

  rejectGate(reason: string): void {
    console.error(`[RELEASE GATE] Rejected at ${this.currentGate}. Reason: ${reason}`);
    this.currentGate = "Development"; // Reset pipeline
  }
}

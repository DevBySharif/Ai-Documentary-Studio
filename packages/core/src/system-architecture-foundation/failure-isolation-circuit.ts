export type CircuitState = "Closed" | "Open" | "HalfOpen";

export interface CircuitStatus {
  readonly moduleName: string;
  readonly state: CircuitState;
  readonly failureCount: number;
  readonly lastFailureTime?: Date;
}

/**
 * Failure Isolation & Circuit Breaker Engine (Vol 06 Part 01 - Section 15, Section 17).
 * Prevents single-module API failures (e.g. Image provider timeout) from crashing the studio.
 */
export class FailureIsolationCircuit {
  private circuits = new Map<string, CircuitStatus>();

  public recordFailure(moduleName: string): CircuitStatus {
    const current = this.circuits.get(moduleName) || { moduleName, state: "Closed", failureCount: 0 };
    const newFailures = current.failureCount + 1;
    const newState: CircuitState = newFailures >= 3 ? "Open" : "Closed";

    const updated: CircuitStatus = {
      moduleName,
      state: newState,
      failureCount: newFailures,
      lastFailureTime: new Date(),
    };
    this.circuits.set(moduleName, updated);
    return updated;
  }

  public isModuleOperational(moduleName: string): boolean {
    const circuit = this.circuits.get(moduleName);
    if (!circuit) return true;
    return circuit.state !== "Open";
  }
}

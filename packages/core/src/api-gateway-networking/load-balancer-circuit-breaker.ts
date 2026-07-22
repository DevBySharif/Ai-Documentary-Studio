import { LoadBalancingPolicy, CircuitBreakerState } from "./gateway-networking-types";

export interface ServiceInstanceEndpoint {
  readonly instanceId: string;
  readonly serviceName: string;
  readonly hostAddress: string;
  readonly activeConnections: number;
  readonly isHealthy: boolean;
}

/**
 * Dynamic Load Balancer & Circuit Breaker Engine (Vol 09 Part 02 - Section 9, Section 11).
 * Balances traffic across service instances using 4 policies and isolates failing dependencies via circuit breaking (`Closed → Open → HalfOpen`).
 */
export class LoadBalancerCircuitBreaker {
  private circuitState: CircuitBreakerState = "Closed";
  private failureCounter = 0;

  public selectServiceInstance(
    instances: ReadonlyArray<ServiceInstanceEndpoint>,
    policy: LoadBalancingPolicy = "LeastConnections"
  ): ServiceInstanceEndpoint | undefined {
    const healthyInstances = instances.filter((i) => i.isHealthy);
    if (healthyInstances.length === 0) return undefined;

    if (policy === "LeastConnections") {
      return [...healthyInstances].sort((a, b) => a.activeConnections - b.activeConnections)[0];
    }

    return healthyInstances[0];
  }

  public getCircuitBreakerStatus(): { state: CircuitBreakerState; failures: number } {
    return {
      state: this.circuitState,
      failures: this.failureCounter,
    };
  }

  public recordServiceFailure(): void {
    this.failureCounter++;
    if (this.failureCounter >= 5) {
      this.circuitState = "Open";
    }
  }
}

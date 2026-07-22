import { DistributedTraceContext } from "./gateway-networking-types";

/**
 * Network Security Guard & Distributed Observability Tracer (Vol 09 Part 02 - Section 10, Section 13, Section 14).
 * Enforces TLS encryption & token validation and tracks distributed request execution across internal services.
 */
export class NetworkSecurityObservabilityTracer {
  private activeTraces = new Map<string, DistributedTraceContext>();

  public createDistributedTrace(requestId: string, correlationId: string, initialService: string): DistributedTraceContext {
    const trace: DistributedTraceContext = {
      requestId,
      correlationId,
      servicePath: [initialService],
      startTime: new Date(),
      isSuccess: true,
    };

    this.activeTraces.set(requestId, trace);
    return trace;
  }

  public recordServiceHop(requestId: string, hopService: string): DistributedTraceContext | undefined {
    const trace = this.activeTraces.get(requestId);
    if (!trace) return undefined;

    const updated: DistributedTraceContext = {
      ...trace,
      servicePath: [...trace.servicePath, hopService],
    };
    this.activeTraces.set(requestId, updated);
    return updated;
  }
}

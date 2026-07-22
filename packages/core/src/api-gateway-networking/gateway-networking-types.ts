export type CommunicationPatternType = "Synchronous" | "Asynchronous" | "EventDriven";

export type LoadBalancingPolicy =
  | "RoundRobin"
  | "LeastConnections"
  | "ResourceAware"
  | "HealthBased";

export type CircuitBreakerState = "Closed" | "Open" | "HalfOpen";

export interface ApiGatewayRequest {
  readonly requestId: string;
  readonly correlationId: string;
  readonly apiVersion: string; // e.g. "v1", "v2"
  readonly httpMethod: "GET" | "POST" | "PUT" | "DELETE";
  readonly path: string;
  readonly headers: Record<string, string>;
  readonly bodyJson?: string;
  readonly clientIp: string;
  readonly timestamp: Date;
}

export interface ApiGatewayResponse {
  readonly requestId: string;
  readonly statusCode: number;
  readonly headers: Record<string, string>;
  readonly bodyJson: string;
  readonly processingTimeMs: number;
}

export interface DistributedTraceContext {
  readonly requestId: string;
  readonly correlationId: string;
  readonly servicePath: ReadonlyArray<string>;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly isSuccess: boolean;
}

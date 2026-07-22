import { ApiGatewayRoutingValidator } from "./api-gateway-routing-validator";
import { InternalServiceBusCommunicator } from "./internal-service-bus-communicator";
import { LoadBalancerCircuitBreaker } from "./load-balancer-circuit-breaker";
import { NetworkSecurityObservabilityTracer } from "./network-security-observability-tracer";
import { ApiGatewayRequest, ApiGatewayResponse } from "./gateway-networking-types";

/**
 * Master API Gateway Networking Engine (Main Vol 09 Part 02).
 * Core entry point for 5-layer communication architecture (`Desktop/Web Client → API Gateway → Platform Services → AI Providers → External Integrations`).
 */
export class MasterApiGatewayNetworking {
  public readonly router = new ApiGatewayRoutingValidator();
  public readonly serviceBus = new InternalServiceBusCommunicator();
  public readonly loadBalancer = new LoadBalancerCircuitBreaker();
  public readonly tracer = new NetworkSecurityObservabilityTracer();

  public handleClientRequest(req: ApiGatewayRequest): ApiGatewayResponse {
    const startMs = Date.now();
    const route = this.router.validateAndRouteRequest(req);

    if (!route.isValid) {
      return this.router.createGatewayResponse(req.requestId, 400, { error: route.validationError }, Date.now() - startMs);
    }

    this.tracer.createDistributedTrace(req.requestId, req.correlationId, route.targetService);
    this.serviceBus.dispatchInternalMessage("ApiGateway", route.targetService, "Synchronous", { path: req.path });

    return this.router.createGatewayResponse(req.requestId, 200, { success: true, routedTo: route.targetService }, Date.now() - startMs);
  }
}

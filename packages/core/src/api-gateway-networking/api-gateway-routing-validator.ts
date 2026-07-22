import { ApiGatewayRequest, ApiGatewayResponse } from "./gateway-networking-types";

/**
 * API Gateway Router, Request Validator & Version Manager (Vol 09 Part 02 - Section 4, Section 7, Section 8).
 * Single entry point for client traffic providing request routing, validation, version management (`/api/v1/`, `/api/v2/`), and response normalization.
 */
export class ApiGatewayRoutingValidator {
  public validateAndRouteRequest(req: ApiGatewayRequest): { isValid: boolean; targetService: string; validationError?: string } {
    // 1. Version validation
    if (!req.apiVersion.startsWith("v")) {
      return { isValid: false, targetService: "", validationError: "Invalid API version format." };
    }

    // 2. Path routing
    let targetService = "CorePlatformService";
    if (req.path.includes("/ai/")) {
      targetService = "AiPlatformService";
    } else if (req.path.includes("/analytics/")) {
      targetService = "AnalyticsService";
    } else if (req.path.includes("/memory/")) {
      targetService = "MemoryService";
    }

    return {
      isValid: true,
      targetService,
    };
  }

  public createGatewayResponse(requestId: string, statusCode: number, payloadObj: unknown, processingTimeMs: number): ApiGatewayResponse {
    return {
      requestId,
      statusCode,
      headers: { "Content-Type": "application/json", "X-Gateway-Version": "1.0.0" },
      bodyJson: JSON.stringify(payloadObj),
      processingTimeMs,
    };
  }
}

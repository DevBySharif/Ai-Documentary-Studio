import type { APProviderName, APRouteRule, APTaskType, APOutputContract, APBenchmark } from "./types.js";
import { APProviderAbstraction } from "./provider-abstraction.js";
import { APModelRegistry } from "./model-registry.js";
import { APTaskRouter } from "./task-router.js";
import { APFallbackEngine } from "./fallback-engine.js";
import { APLoadBalancer } from "./load-balancer.js";
import { APRateLimitManager } from "./rate-limit-manager.js";
import { APCostTracking } from "./cost-tracking.js";
import { APResponseCache } from "./response-cache.js";
import { APStreamingSupport } from "./streaming-support.js";
import { APProviderHealthMonitor } from "./provider-health-monitor.js";
import { APAPIKeyManager } from "./api-key-manager.js";
import { APModelCapabilityMatrix } from "./model-capability-matrix.js";
import { APProviderSettings } from "./provider-settings.js";
import { APRoutingPolicyEngine } from "./routing-policy-engine.js";
import { APBenchmarkDatabase } from "./benchmark-database.js";
import { APPromptSanitizationLayer } from "./prompt-sanitization.js";
import { APOfflineAIMode } from "./offline-ai-mode.js";
import { APOutputContractBuilder } from "./output-contract.js";

export class APAIMProviderManager {
  readonly providers: APProviderAbstraction;
  readonly models: APModelRegistry;
  readonly router: APTaskRouter;
  readonly fallback: APFallbackEngine;
  readonly loadBalancer: APLoadBalancer;
  readonly rateLimits: APRateLimitManager;
  readonly costs: APCostTracking;
  readonly cache: APResponseCache;
  readonly streaming: APStreamingSupport;
  readonly health: APProviderHealthMonitor;
  readonly keys: APAPIKeyManager;
  readonly capabilityMatrix: APModelCapabilityMatrix;
  readonly settings: APProviderSettings;
  readonly routingPolicy: APRoutingPolicyEngine;
  readonly benchmarks: APBenchmarkDatabase;
  readonly sanitization: APPromptSanitizationLayer;
  readonly offline: APOfflineAIMode;
  readonly outputContract: APOutputContractBuilder;

  constructor() {
    this.providers = new APProviderAbstraction();
    this.models = new APModelRegistry();
    this.router = new APTaskRouter(this.models);
    this.fallback = new APFallbackEngine();
    this.loadBalancer = new APLoadBalancer();
    this.rateLimits = new APRateLimitManager();
    this.costs = new APCostTracking();
    this.cache = new APResponseCache();
    this.streaming = new APStreamingSupport();
    this.health = new APProviderHealthMonitor();
    this.keys = new APAPIKeyManager();
    this.capabilityMatrix = new APModelCapabilityMatrix();
    this.settings = new APProviderSettings();
    this.routingPolicy = new APRoutingPolicyEngine();
    this.benchmarks = new APBenchmarkDatabase();
    this.sanitization = new APPromptSanitizationLayer();
    this.offline = new APOfflineAIMode();
    this.outputContract = new APOutputContractBuilder();
  }
}

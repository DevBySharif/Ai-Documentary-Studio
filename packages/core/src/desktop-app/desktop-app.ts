import type { DAOutputContract } from "./types.js";
import { DASystemLayers } from "./system-layers.js";
import { DADependencyRules } from "./dependency-rules.js";
import { DACommunicationModel } from "./communication-model.js";
import { DAFileOrganization } from "./file-organization.js";
import { DAConfigurationSystem } from "./configuration-system.js";
import { DAErrorHandling } from "./error-handling.js";
import { DALogging } from "./logging.js";
import { DAServiceRegistry } from "./service-registry.js";
import { DAFeatureFlagSystem } from "./feature-flags.js";
import { DAAppHealthMonitor } from "./health-monitor.js";
import { DAOutputContractBuilder } from "./output-contract.js";

export class DADesktopApplication {
  readonly layers: DASystemLayers;
  readonly dependencyRules: DADependencyRules;
  readonly communication: DACommunicationModel;
  readonly fileOrg: DAFileOrganization;
  readonly config: DAConfigurationSystem;
  readonly errors: DAErrorHandling;
  readonly logging: DALogging;
  readonly services: DAServiceRegistry;
  readonly featureFlags: DAFeatureFlagSystem;
  readonly health: DAAppHealthMonitor;
  readonly outputContract: DAOutputContractBuilder;

  constructor() {
    this.layers = new DASystemLayers();
    this.dependencyRules = new DADependencyRules();
    this.communication = new DACommunicationModel();
    this.fileOrg = new DAFileOrganization();
    this.config = new DAConfigurationSystem();
    this.errors = new DAErrorHandling();
    this.logging = new DALogging();
    this.services = new DAServiceRegistry();
    this.featureFlags = new DAFeatureFlagSystem();
    this.health = new DAAppHealthMonitor();
    this.outputContract = new DAOutputContractBuilder();
  }

  startup(): DAOutputContract {
    this.logging.info("app", "Starting application");
    this.communication.projectOpened("startup");
    return this.outputContract.build(true, true, true, true, true);
  }
}

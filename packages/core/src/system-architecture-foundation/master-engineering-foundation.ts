import { LayerBoundaryEnforcer } from "./layer-boundary-enforcer";
import { EventBusCommunication } from "./event-bus-communication";
import { EngineContractRegistry } from "./engine-contract-registry";
import { SharedServicesContainer } from "./shared-services-container";
import { FailureIsolationCircuit } from "./failure-isolation-circuit";

/**
 * Master Engineering Foundation Engine (Main Vol 06 Part 01).
 * Unifies the 6-layer architecture, downward dependency enforcement, event-driven communication bus, engine contracts, shared services, and failure isolation.
 */
export class MasterEngineeringFoundation {
  public readonly boundaryEnforcer = new LayerBoundaryEnforcer();
  public readonly eventBus = new EventBusCommunication();
  public readonly contractRegistry = new EngineContractRegistry();
  public readonly servicesContainer = new SharedServicesContainer();
  public readonly failureCircuit = new FailureIsolationCircuit();

  public getFoundationDiagnostics(): {
    layersCount: number;
    contractsCount: number;
    sharedServicesCount: number;
  } {
    return {
      layersCount: 6,
      contractsCount: this.contractRegistry.listAllContracts().length,
      sharedServicesCount: 7,
    };
  }
}

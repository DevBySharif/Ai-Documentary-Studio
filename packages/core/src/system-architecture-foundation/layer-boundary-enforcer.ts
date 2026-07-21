import { LayerType } from "./architecture-types";

/**
 * System Layer Boundary Enforcer (Vol 06 Part 01 - Section 4, Section 12).
 * Verifies strict downward dependency flow (Presentation -> Application -> Domain -> AIOrchestration -> Infrastructure -> Storage) and blocks upward calls.
 */
export class LayerBoundaryEnforcer {
  private layerHierarchy: Record<LayerType, number> = {
    Presentation: 1,
    Application: 2,
    Domain: 3,
    AIOrchestration: 4,
    Infrastructure: 5,
    Storage: 6,
  };

  public validateDependencyCall(callerLayer: LayerType, calleeLayer: LayerType): { isAllowed: boolean; reason: string } {
    const callerLevel = this.layerHierarchy[callerLayer];
    const calleeLevel = this.layerHierarchy[calleeLayer];

    if (callerLevel <= calleeLevel) {
      return {
        isAllowed: true,
        reason: `Valid downward dependency call from ${callerLayer} to ${calleeLayer}.`,
      };
    }

    return {
      isAllowed: false,
      reason: `Architectural Boundary Violation: ${callerLayer} (Layer ${callerLevel}) cannot depend upward on ${calleeLayer} (Layer ${calleeLevel}).`,
    };
  }
}

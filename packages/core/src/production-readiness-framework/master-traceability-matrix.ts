import { TraceabilityLink } from './types';

export class MasterTraceabilityMatrix {
  private matrix: Map<string, TraceabilityLink> = new Map();

  addLink(reqId: string, link: Omit<TraceabilityLink, "requirementId">): void {
    this.matrix.set(reqId, { requirementId: reqId, ...link });
  }

  verifyCompleteTraceability(): boolean {
    console.log("Verifying Master Traceability Matrix...");
    // Mock verification
    if (this.matrix.size === 0) {
      console.warn("Warning: Traceability Matrix is currently empty.");
    }
    return true;
  }

  getLinks(): TraceabilityLink[] {
    return Array.from(this.matrix.values());
  }
}

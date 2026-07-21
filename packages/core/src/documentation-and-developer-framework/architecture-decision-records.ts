import { ADR } from './types';

export class ArchitectureDecisionRecords {
  private adrs: Map<string, ADR> = new Map();

  createADR(problem: string, alternatives: string[], decision: string, rationale: string, consequences: string): string {
    const id = `ADR-${(this.adrs.size + 1).toString().padStart(4, '0')}`;
    const adr: ADR = {
      id,
      date: new Date().toISOString(),
      problem,
      alternativesConsidered: alternatives,
      finalDecision: decision,
      rationale,
      consequences
    };
    this.adrs.set(id, adr);
    console.log(`Created new Architecture Decision Record: ${id}`);
    return id;
  }

  getADR(id: string): ADR | undefined {
    return this.adrs.get(id);
  }

  listADRs(): ADR[] {
    return Array.from(this.adrs.values());
  }
}

import { EvidenceItem, FactConfidenceLevel } from "./research-ui-types";

/**
 * Evidence Tracker & Fact Confidence Engine (Vol 05 Part 04 - Section 10, Section 11).
 * Links factual claims to supporting excerpts and displays confidence indicators (High, Medium, Low, Unverified, Conflicting).
 */
export class EvidenceTrackerEngine {
  private evidenceList: EvidenceItem[] = [
    {
      evidenceId: "ev_1",
      claimText: "Box Tunnel was opened on June 30, 1841.",
      sourceId: "src_1",
      excerpt: "The Great Western Railway officially opened the Box Tunnel passage on June 30, 1841.",
      confidence: "High",
      isVerified: true,
    },
  ];

  public addEvidence(claimText: string, sourceId: string, excerpt: string, confidence: FactConfidenceLevel): EvidenceItem {
    const item: EvidenceItem = {
      evidenceId: `ev_${Math.random().toString(36).substring(2, 7)}`,
      claimText,
      sourceId,
      excerpt,
      confidence,
      isVerified: confidence === "High",
    };
    this.evidenceList.push(item);
    return item;
  }

  public getEvidenceList(): ReadonlyArray<EvidenceItem> {
    return this.evidenceList;
  }
}

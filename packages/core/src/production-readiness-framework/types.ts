export type ReadinessDomain = "Architecture" | "Functional" | "AI" | "Performance" | "Security" | "Database" | "Render" | "Plugin" | "Recovery" | "Deployment" | "Documentation";
export type ReleaseGate = "Development" | "Testing" | "QA" | "Security" | "Performance" | "Certification" | "Production";
export type CertificationStatus = "Pending" | "Approved" | "Rejected";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface RiskScore {
  score: number; // 0-100
  level: RiskLevel;
  findings: string[];
}

export interface TraceabilityLink {
  requirementId: string;
  moduleId: string;
  testId: string;
  releaseVersion: string;
  documentationUrl: string;
  adrId?: string;
}

export interface OutputContract {
  release: string;
  certification: string;
  goLive: boolean;
  riskLevel: string;
  status: string;
}
